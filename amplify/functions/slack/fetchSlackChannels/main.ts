import { Schema } from '../../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/send-slack-message'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()
const getValidSlackAccessToken = async (userId: string) => {
	const user = await client.models.User.get({ id: userId })

	const slack = user.data?.providers?.slack
	if (!slack) return { channels: [] }

	const now = Math.floor(Date.now() / 1000)
	const buffer = 60 // refresh 1 minute before expiration

	if (slack.oauth?.expiresAt && slack.oauth?.expiresAt > now + buffer) {
		// Token is still valid
		return slack.oauth!.accessToken
	}

	// Token expired or about to expire → refresh it
	const params = new URLSearchParams()
	params.append('grant_type', 'refresh_token')
	params.append('refresh_token', slack.oauth!.refreshToken!)
	params.append('client_id', env.SLACK_CLIENT_ID)
	params.append('client_secret', env.SLACK_CLIENT_SECRET)

	const res = await fetch('https://slack.com/api/oauth.v2.access', {
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
	const newExpiresAt = Math.floor(Date.now() / 1000) + data.expires_in

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

export const handler: Schema['fetchSlackChannels']['functionHandler'] = async (
	event
) => {
	console.log('Fetching Slack channels', event.arguments)

	// 1. get the user from the database to get their accesstoken
	const res = await client.models.User.get({ id: event.arguments.userId })
	const user = res.data

	if (!user) {
		return { channels: [] }
	}

	const accessToken = await getValidSlackAccessToken(user.id)

	try {
		const res = await fetch(
			'https://slack.com/api/conversations.list?exclude_archived=true&limit=100',
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		)

		const data = await res.json()
		console.log('data', data)

		type SlackChannel = {
			id: string
			name: string
		}

		const channels = data.channels.map((channel: SlackChannel) => ({
			id: channel.id,
			name: channel.name,
		}))

		return { channels }
	} catch (error) {
		console.error('Error revoking Slack access token:', error)
		return { channels: [] }
	}
}
