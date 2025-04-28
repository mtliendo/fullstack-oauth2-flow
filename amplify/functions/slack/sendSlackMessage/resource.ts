import { defineFunction, secret } from '@aws-amplify/backend'

export const sendSlackMessage = defineFunction({
	name: 'send-slack-message',
	resourceGroupName: 'data',
	entry: './main.ts',
	runtime: 22,
	environment: {
		SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID as string,
		SLACK_CLIENT_SECRET: secret('SLACK_CLIENT_SECRET'),
	},
})
