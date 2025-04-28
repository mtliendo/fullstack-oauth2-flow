import { Schema } from '../../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/send-slack-message'
import { getValidSlackAccessToken } from '../utils'
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

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
