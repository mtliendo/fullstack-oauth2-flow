import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { postConfirmation } from './functions/postConfirmation/resource'
import { generateOauthAuthorizationUrl } from './functions/oauth/authorize/resource'
import { oauthCallback } from './functions/oauth/callback/resource'
import { sendSlackMessage } from './functions/slack/sendSlackMessage/resource'
import { disconnectFromOauth } from './functions/oauth/disconnect/resource'
import { fetchSlackChannels } from './functions/slack/fetchSlackChannels/resource'
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'

const backend = defineBackend({
	auth,
	data,
	postConfirmation,
	generateOauthAuthorizationUrl,
	oauthCallback,
	disconnectFromOauth,
	sendSlackMessage,
	fetchSlackChannels,
})

const cfnOauthStateTable =
	backend.data.resources.cfnResources.amplifyDynamoDbTables['OAuthState']

cfnOauthStateTable.timeToLiveAttribute = {
	attributeName: 'ttl',
	enabled: true,
}

const oauthCallbackLambda = backend.oauthCallback.resources.lambda

const lambdafUrl = oauthCallbackLambda.addFunctionUrl({
	authType: FunctionUrlAuthType.NONE,
})

backend.addOutput({
	custom: {
		oauthCallbackUrl: lambdafUrl.url,
	},
})
