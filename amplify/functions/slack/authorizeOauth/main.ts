import { type Schema } from '../../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/authorize-slack-oauth'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

export const handler: Schema['authorizeSlack']['functionHandler'] = async (
	event
) => {
	//1. generate a random state
	const state = crypto.randomUUID() + '::' + event.arguments.userId
	//2. save the state to the database
	const unixEpochSeconds = Math.floor(Date.now() / 1000)
	const ttl = unixEpochSeconds + 60 * 5 // 5 minutes from now in seconds (unix timestamp)

	await client.models.OAuthState.create({
		userId: event.arguments.userId,
		stateValue: state,
		provider: 'slack',
		expiresAt: ttl,
		ttl,
	})
	//3. redirect to the slack oauth page
	const slackClientId = env.SLACK_CLIENT_ID
	const slackRedirectUri = env.SLACK_REDIRECT_URI

	const userScopes = ['chat:write', 'channels:read', 'users:read']

	const url = new URL('https://slack.com/oauth/v2/authorize')
	url.searchParams.set('client_id', slackClientId)
	url.searchParams.set('user_scope', userScopes.join(','))
	url.searchParams.set('redirect_uri', slackRedirectUri)
	url.searchParams.set('state', state)

	//4. return the url to the client

	return {
		authorizationUrl: url.toString(),
	}
}
