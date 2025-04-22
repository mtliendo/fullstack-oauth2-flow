import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { postConfirmation } from './functions/postConfirmation/resource'
import { authorizeSlackOauth } from './functions/slack/authorizeOauth/resource'
import { slackCallback } from './functions/slack/callback/resource'
import { sendSlackMessage } from './functions/slack/sendSlackMessage/resource'
import { disconnectFromSlack } from './functions/slack/disconnectFromSlack/resource'
import { fetchSlackChannels } from './functions/slack/fetchSlackChannels/resource'
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'

const backend = defineBackend({
	auth,
	data,
	postConfirmation,
	authorizeSlackOauth,
	slackCallback,
	disconnectFromSlack,
	sendSlackMessage,
	fetchSlackChannels,
})

const cfnOauthStateTable =
	backend.data.resources.cfnResources.amplifyDynamoDbTables['OAuthState']

cfnOauthStateTable.timeToLiveAttribute = {
	attributeName: 'ttl',
	enabled: true,
}

const slackCallbackLambda = backend.slackCallback.resources.lambda

const lambdafUrl = slackCallbackLambda.addFunctionUrl({
	authType: FunctionUrlAuthType.NONE,
})

backend.addOutput({
	custom: {
		slackCallbackUrl: lambdafUrl.url,
	},
})
