import { Schema } from '../../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/send-slack-message'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

export const handler: Schema['disconnectFromSlack']['functionHandler'] = async (
	event
) => {
	console.log('Disconnecting from Slack', event.arguments)

	const user = await client.models.User.get({ id: event.arguments.userId })
	const accessToken = user.data?.providers?.slack?.oauth?.accessToken

	if (!accessToken) {
		return { success: false, message: 'No access token found' }
	}

	try {
		await fetch('https://slack.com/api/auth.revoke', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({}), // required even if empty
		})
	} catch (error) {
		console.error('Error revoking Slack access token:', error)
	}

	// Even if the revoke fails, the user wants to remove the slack provider
	try {
		await client.models.User.update({
			id: event.arguments.userId,
			providers: {
				slack: null,
			},
		})
		return { success: true, message: 'Slack disconnected' }
	} catch (error) {
		console.error('Error updating user:', error)
		return { success: false, message: 'Error updating user' }
	}
}
