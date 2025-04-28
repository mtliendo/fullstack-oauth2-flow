import { type Schema } from '../../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/generate-oauth-authorization-url'
import { oauthProviders } from '../../utils/providerConfig'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

export const handler: Schema['generateOauthAuthorizationUrl']['functionHandler'] =
	async (event) => {
		const { provider } = event.arguments as {
			provider: keyof typeof oauthProviders
		}
		//1. generate a random state
		const state =
			crypto.randomUUID() + '::' + event.arguments.userId + '::' + provider
		const unixEpochSeconds = Math.floor(Date.now() / 1000)
		const ttl = unixEpochSeconds + 60 * 5 // 5 minutes from now in seconds (unix timestamp)

		//2. save the state to the database
		await client.models.OAuthState.create({
			userId: event.arguments.userId,
			stateValue: state,
			provider: provider,
			expiresAt: ttl,
			ttl: ttl,
		})
		//3. redirect to the provider oauth page
		const url = new URL(oauthProviders[provider].authUrl)
		url.searchParams.set('client_id', oauthProviders[provider].clientId)
		url.searchParams.set(
			'user_scope',
			oauthProviders[provider].scopes.join(',')
		)
		url.searchParams.set('redirect_uri', oauthProviders[provider].redirectUri)
		url.searchParams.set('state', state)

		//4. return the url to the client
		return {
			authorizationUrl: url.toString(),
		}
	}
