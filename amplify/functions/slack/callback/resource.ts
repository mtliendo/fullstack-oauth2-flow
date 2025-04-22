import { defineFunction } from '@aws-amplify/backend'

export const slackCallback = defineFunction({
	name: 'slack-callback',
	resourceGroupName: 'data',
	entry: './main.ts',
	runtime: 22,
	environment: {
		SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID as string,
		SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET as string,
		SLACK_REDIRECT_URI: process.env.SLACK_REDIRECT_URI as string,
		HOST_URL: process.env.HOST_URL as string,
	},
})
