import { Schema } from '../../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/send-slack-message'
import { oauthProviders } from '../../utils/providerConfig'
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

export const handler: Schema['disconnectFromSlack']['functionHandler'] = async (
	event
) => {
	console.log('Disconnecting from Slack', event.arguments)

	const user = await client.models.User.get({ id: event.arguments.userId })
	const accessToken = user.data?.providers?.slack?.oauth?.accessToken
	const provider = event.arguments.provider as keyof typeof oauthProviders

	if (!accessToken) {
		return { success: false, message: 'No access token found' }
	}

	/**
	 * Revokes the OAuth token for a given provider
	 */
	const revokeOAuthToken = async (
		revocationUrl: string,
		accessToken: string
	) => {
		try {
			await fetch(revocationUrl, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({}), // required even if empty
			})
		} catch (error) {
			console.error(`Error revoking access token:`, error)
		}
	}

	/**
	 * Removes the provider from the user's account
	 */
	const removeProviderFromUser = async (userId: string, provider: string) => {
		try {
			await client.models.User.update({
				id: userId,
				providers: {
					[provider]: null,
				},
			})
			return { success: true, message: `${provider} disconnected` }
		} catch (error) {
			console.error('Error updating user:', error)
			return { success: false, message: 'Error updating user' }
		}
	}

	// Handle the provider-specific disconnection logic
	await revokeOAuthToken(oauthProviders.slack.disconnectUrl, accessToken)

	// Remove the provider from the user's account
	const result = await removeProviderFromUser(event.arguments.userId, provider)
	return result
}
