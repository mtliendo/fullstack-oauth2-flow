import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { postConfirmation } from '../functions/postConfirmation/resource'
import { authorizeSlackOauth } from '../functions/slack/authorizeOauth/resource'
import { slackCallback } from '../functions/slack/callback/resource'
import { sendSlackMessage } from '../functions/slack/sendSlackMessage/resource'
import { disconnectFromSlack } from '../functions/slack/disconnectFromSlack/resource'
import { fetchSlackChannels } from '../functions/slack/fetchSlackChannels/resource'
const schema = a
	.schema({
		Oauth: a.customType({
			accessToken: a.string(),
			refreshToken: a.string(),
			scope: a.string(),
			expiresAt: a.integer(),
		}),
		SupportedProviders: a.enum(['slack']),
		Providers: a.customType({
			slack: a.customType({
				oauth: a.ref('Oauth'),
				metadata: a.customType({
					teamId: a.string(),
					teamName: a.string(),
				}),
			}),
		}),
		SlackChannel: a.customType({
			id: a.string(),
			name: a.string(),
		}),
		User: a
			.model({
				email: a.email().required(),
				owner: a
					.string()
					.required()
					.authorization((allow) => [allow.owner().to(['read'])]),
				providers: a.ref('Providers'),
			})
			.authorization((allow) => [allow.owner()]),
		OAuthState: a
			.model({
				stateValue: a.string().required(),
				expiresAt: a.integer().required(),
				provider: a.ref('SupportedProviders'),
				userId: a.string().required(),
				ttl: a.integer().required(),
			})
			.authorization((allow) => [allow.group('NONE')])
			.secondaryIndexes((index) => [index('userId')]),
		authorizeSlack: a
			.mutation()
			.handler(a.handler.function(authorizeSlackOauth))
			.arguments({
				userId: a.string().required(),
				provider: a.ref('SupportedProviders'),
			})
			.returns(a.customType({ authorizationUrl: a.url() }))
			.authorization((allow) => [allow.authenticated()]),
		disconnectFromSlack: a
			.mutation()
			.handler(a.handler.function(disconnectFromSlack))
			.arguments({
				userId: a.string().required(),
				provider: a.ref('SupportedProviders'),
			})
			.returns(a.customType({ success: a.boolean(), message: a.string() }))
			.authorization((allow) => [allow.authenticated()]),
		fetchSlackChannels: a
			.mutation()
			.handler(a.handler.function(fetchSlackChannels))
			.arguments({
				userId: a.string().required(),
			})
			.returns(a.customType({ channels: a.ref('SlackChannel').array() }))
			.authorization((allow) => [allow.authenticated()]),
		sendSlackMessage: a
			.mutation()
			.handler(a.handler.function(sendSlackMessage))
			.arguments({
				message: a.string().required(),
				userId: a.string().required(),
				channel: a.string().required(),
			})
			.returns(a.customType({ success: a.boolean(), error: a.boolean() }))
			.authorization((allow) => [allow.authenticated()]),
	})
	.authorization((allow) => [
		allow.resource(postConfirmation).to(['mutate']),
		allow.resource(authorizeSlackOauth).to(['mutate']),
		allow.resource(slackCallback).to(['mutate', 'query']),
		allow.resource(sendSlackMessage).to(['mutate', 'query']),
		allow.resource(disconnectFromSlack).to(['mutate', 'query']),
		allow.resource(fetchSlackChannels).to(['mutate', 'query']),
	])

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
	name: 'fullstack-oauth2-flow',
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'userPool',
	},
})
