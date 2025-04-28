import { defineFunction } from '@aws-amplify/backend'

export const disconnectFromOauth = defineFunction({
	name: 'disconnect-from-oauth',
	resourceGroupName: 'data',
	entry: './main.ts',
	runtime: 22,
})
