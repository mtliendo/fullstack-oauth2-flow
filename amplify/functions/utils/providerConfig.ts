import { env } from '$amplify/env/generate-oauth-authorization-url'

export const oauthProviders = {
	slack: {
		provider: 'slack',
		authUrl: 'https://slack.com/oauth/v2/authorize',
		accessTokenEndpoint: 'https://slack.com/api/oauth.v2.access',
		disconnectUrl: 'https://slack.com/api/auth.revoke',
		clientId: env.SLACK_CLIENT_ID!,
		redirectUri: env.REDIRECT_URI!,
		scopes: ['chat:write', 'channels:read', 'users:read'],
		scopeParam: 'user_scope',
		ttl: 11 * 60 * 60, // 11 hours in seconds (Slack oauth token expires in 12 hours)
	},
}
