import { Schema } from '../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/send-slack-message'
import { oauthProviders } from '../utils/providerConfig'
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

export const getValidSlackAccessToken = async (userId: string) => {
	const user = await client.models.User.get({ id: userId })
	const slackTTL = oauthProviders.slack.ttl

	const slack = user.data?.providers?.slack
	if (!slack) return { channels: [] }

	const nowInSeconds = Math.floor(Date.now() / 1000)

	if (slack.oauth?.expiresAt && slack.oauth?.expiresAt > nowInSeconds) {
		// Token is still valid
		return slack.oauth!.accessToken
	}

	// Token expired or about to expire → refresh it
	const params = new URLSearchParams()
	params.append('grant_type', 'refresh_token')
	params.append('refresh_token', slack.oauth!.refreshToken!)
	params.append('client_id', oauthProviders.slack.clientId)
	params.append('client_secret', env.SLACK_CLIENT_SECRET)

	const res = await fetch(oauthProviders.slack.accessTokenEndpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params,
	})

	const data = await res.json()
	if (!data.ok) {
		console.error('Failed to refresh token', data)
		return { channels: [] }
	}

	const newToken = data.access_token
	const newRefresh = data.refresh_token
	const newExpiresAt = nowInSeconds + slackTTL

	// Update user tokens
	await client.models.User.update({
		id: userId,
		providers: {
			slack: {
				...slack,
				oauth: {
					...slack.oauth,
					accessToken: newToken,
					refreshToken: newRefresh,
					expiresAt: newExpiresAt,
				},
			},
		},
	})

	return newToken
}
