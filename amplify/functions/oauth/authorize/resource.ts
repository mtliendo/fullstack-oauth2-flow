import { defineFunction } from '@aws-amplify/backend'

export const generateOauthAuthorizationUrl = defineFunction({
	name: 'generate-oauth-authorization-url',
	resourceGroupName: 'data',
	entry: './main.ts',
	runtime: 22,
	environment: {
		// https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/#local-environment-2
		SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID as string,
		SLACK_REDIRECT_URI: process.env.SLACK_REDIRECT_URI as string,
	},
})
