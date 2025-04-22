import { type Schema } from '../../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/slack-callback'
import { LambdaFunctionURLHandler } from 'aws-lambda'
import { oauthProviders } from '../../utils/providerConfig'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

export const handler: LambdaFunctionURLHandler = async (
	event
): Promise<{
	statusCode: number
	headers: { Location: string }
}> => {
	//1. get the state from the database
	const { code, state } = event.queryStringParameters as {
		code: string
		state: string
	}
	const userId = state.split('::')[1]
	const provider = state.split('::')[2] as keyof typeof oauthProviders

	const oauthState = await client.models.OAuthState.listOAuthStateByUserId(
		{ userId: userId },
		{ filter: { provider: { eq: provider } } }
	)

	//2. verify the state by grabbing the most recent state
	const mostRecentState = oauthState.data.sort(
		(a, b) => b.expiresAt - a.expiresAt
	)[0].stateValue

	console.log('the fetched state', mostRecentState)

	if (mostRecentState !== state) {
		return {
			statusCode: 302,
			headers: {
				Location: `${env.HOST_URL}/secondary?error=invalid_state`,
			},
		}
	}

	//3. call the api to get the access token

	const params = new URLSearchParams()
	params.append('grant_type', 'authorization_code')
	params.append('code', code)
	params.append('redirect_uri', oauthProviders[provider].redirectUri)
	params.append('client_id', oauthProviders[provider].clientId)
	params.append('client_secret', env.SLACK_CLIENT_SECRET!)

	const res = await fetch(oauthProviders[provider].accessTokenEndpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: params,
	})
	const data = await res.json()

	if (!data.ok) {
		console.log('the not ok data from slack', data)
		return {
			statusCode: 302,
			headers: {
				Location: `${env.HOST_URL}/secondary?error=bad_request`,
			},
		}
	}

	//4. save the access token to the database
	console.log('the ok data from slack', data)
	if (data.ok && data.authed_user.access_token) {
		await client.models.User.update({
			id: userId,
			providers: {
				slack: {
					oauth: {
						accessToken: data.authed_user.access_token,
						refreshToken: data.authed_user.refresh_token,
						scope: data.authed_user.scope,
						expiresAt:
							Math.floor(Date.now() / 1000) + data.authed_user.expires_in,
					},
					metadata: {
						teamId: data.team.id,
						teamName: data.team.name,
					},
				},
			},
		})

		return {
			statusCode: 302,
			headers: {
				Location: `${env.HOST_URL}/secondary?success=true`,
			},
		}
	}

	//5. return the success to the client

	return {
		statusCode: 302,
		headers: {
			Location: `${env.HOST_URL}/secondary?error=user_update_error`,
		},
	}
}
