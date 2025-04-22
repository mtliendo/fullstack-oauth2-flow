import { defineFunction } from '@aws-amplify/backend'

export const disconnectFromSlack = defineFunction({
	name: 'disconnect-from-slack',
	resourceGroupName: 'data',
	entry: './main.ts',
	runtime: 22,
})
