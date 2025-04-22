import { Authenticator } from '@aws-amplify/ui-react'
import { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useState, useEffect } from 'react'
import { FaSlack } from 'react-icons/fa'

const client = generateClient<Schema>()

function Settings() {
	const [userId, setUserId] = useState('')
	const [hasSlackToken, setHasSlackToken] = useState(false)
	const [accessToken, setAccessToken] = useState('')
	useEffect(() => {
		const getUserId = async () => {
			const user = await client.models.User.list()
			const userId = user.data?.[0].id
			setUserId(userId)

			// Check if user has Slack token
			if (user.data?.[0].providers?.slack?.oauth?.accessToken) {
				setHasSlackToken(true)
				setAccessToken(user.data?.[0].providers?.slack?.oauth?.accessToken)
			}
		}
		getUserId()
	}, [accessToken])

	const handleAuthorizeSlack = async () => {
		const res = await client.mutations.authorizeSlack({
			userId: userId,
		})
		if (res.data?.authorizationUrl) {
			window.location.href = res.data.authorizationUrl
		}
	}

	const handleDisconnectSlack = async () => {
		const res = await client.mutations.disconnectFromSlack({
			userId: userId,
		})
		if (res.data?.success) {
			setHasSlackToken(false)
			setAccessToken('')
		}
	}

	return (
		<Authenticator>
			<div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-8">
				<div className="w-full max-w-2xl bg-base-100 p-8 rounded-lg shadow-lg">
					<h1 className="text-3xl font-bold mb-8">Settings</h1>

					<div className="space-y-6">
						<div className="card bg-base-200">
							<div className="card-body">
								<h2 className="card-title text-xl">Authorized Providers</h2>

								<div className="flex items-center justify-between mt-4">
									<div className="flex items-center gap-2">
										<FaSlack size={24} color="#4A154B" />
										<span>Slack</span>
									</div>

									{hasSlackToken ? (
										<button
											onClick={handleDisconnectSlack}
											className="btn btn-error btn-sm"
										>
											Disconnect Slack
										</button>
									) : (
										<button
											onClick={handleAuthorizeSlack}
											className="btn btn-primary btn-sm"
										>
											Authorize Slack
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Authenticator>
	)
}

export default Settings
