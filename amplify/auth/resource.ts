import { defineAuth } from '@aws-amplify/backend'
import { postConfirmation } from '../functions/postConfirmation/resource'

export const auth = defineAuth({
	loginWith: {
		email: true,
	},
	triggers: {
		postConfirmation,
	},
})
