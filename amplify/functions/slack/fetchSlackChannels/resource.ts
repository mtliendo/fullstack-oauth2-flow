import { defineFunction } from '@aws-amplify/backend'

export const fetchSlackChannels = defineFunction({
	name: 'fetch-slack-channels',
	resourceGroupName: 'data',
	entry: './main.ts',
	runtime: 22,
})
