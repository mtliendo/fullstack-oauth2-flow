import { Schema } from '../../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/send-slack-message'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

//todo: move this to a util file since it's reused in the fetchSlackChannels function
const getValidSlackAccessToken = async (userId: string) => {
	const user = await client.models.User.get({ id: userId })

	const slack = user.data?.providers?.slack
	if (!slack) throw new Error('Slack is not connected for this user.')

	const now = Math.floor(Date.now() / 1000)
	const buffer = 60 // refresh 1 minute before expiration

	if (slack.oauth?.expiresAt && slack.oauth?.expiresAt > now + buffer) {
		// Token is still valid
		return slack.oauth?.accessToken
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
		throw new Error('Slack token refresh failed.')
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

export const handler: Schema['sendSlackMessage']['functionHandler'] = async (
	event
) => {
	console.log('Sending Slack message', event.arguments)
	// 1. get the user from the database to get their accesstoken
	const res = await client.models.User.get({ id: event.arguments.userId })
	const user = res.data

	if (!user) {
		throw new Error('No user found')
	}

	const accessToken = await getValidSlackAccessToken(user.id)
	console.log('user', user)
	console.log('accessToken', accessToken)
	try {
		const slackResponse = await fetch(
			'https://slack.com/api/chat.postMessage',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json; charset=utf-8',
				},
				body: JSON.stringify({
					channel: event.arguments.channel,
					text: event.arguments.message,
				}),
			}
		)
		const slackData = await slackResponse.json()
		console.log(slackData)
	} catch (error) {
		console.error(error)
	}

	return {
		success: true,
		error: false,
	}
}
