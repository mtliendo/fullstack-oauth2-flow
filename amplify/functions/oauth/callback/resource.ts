import { defineFunction, secret } from '@aws-amplify/backend'

export const oauthCallback = defineFunction({
	name: 'oauth-callback',
	resourceGroupName: 'data',
	entry: './main.ts',
	runtime: 22,
	environment: {
		SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID as string,
		SLACK_CLIENT_SECRET: secret('SLACK_CLIENT_SECRET'),
		REDIRECT_URI: process.env.REDIRECT_URI as string,
		HOST_URL: process.env.HOST_URL as string,
	},
})
