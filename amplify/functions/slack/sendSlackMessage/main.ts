import { Schema } from '../../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/send-slack-message'
import { getValidSlackAccessToken } from '../utils'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

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
