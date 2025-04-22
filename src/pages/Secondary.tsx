import { Authenticator, Link } from '@aws-amplify/ui-react'
import { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useState } from 'react'
import { useEffect } from 'react'

const client = generateClient<Schema>()

function ProtectedSecondary() {
	const [userId, setUserId] = useState('')
	const [teamName, setTeamName] = useState<string | null>()
	const [accessToken, setAccessToken] = useState<string | null>()

	const [channels, setChannels] = useState<
		{
			id: string
			name: string
		}[]
	>([])
	useEffect(() => {
		const getUserId = async () => {
			const user = await client.models.User.list()
			const userId = user.data?.[0].id
			setUserId(userId)
			const teamName = user.data?.[0].providers?.slack?.metadata?.teamName
			setTeamName(teamName)
			const accessToken = user.data?.[0].providers?.slack?.oauth?.accessToken
			setAccessToken(accessToken)
		}
		getUserId()
	}, [])

	const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const message = formData.get('message') as string
		const channelId = formData.get('channel') as string
		console.log(message)
		const res = await client.mutations.sendSlackMessage({
			channel: channelId,
			message,
			userId: userId,
		})
		console.log(res)
	}

	useEffect(() => {
		const fetchChannels = async () => {
			const res = await client.mutations.fetchSlackChannels({
				userId: userId,
			})
			console.log(res)
			if (res.data?.channels) {
				const channels = res.data.channels as unknown as {
					id: string
					name: string
				}[]
				setChannels(channels)
			}
		}
		fetchChannels()
	}, [userId])

	return (
		<Authenticator className="mt-16">
			<div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
				<div className="card w-full max-w-md bg-base-100 shadow-xl">
					<div className="card-body">
						{accessToken ? (
							<>
								<div className="flex justify-center">
									<h2 className="card-title text-3xl font-bold mb-6">
										Post to Slack
									</h2>
								</div>
								<p className="text-center text-base-content/70 mb-8">
									Send a message to{' '}
									<span className="font-bold">{teamName}</span>
								</p>
								<form onSubmit={handleSendMessage} className="space-y-4">
									<div className="form-control">
										<select
											className="select select-bordered w-full mb-4"
											name="channel"
										>
											{channels.map((c) => (
												<option key={c.id} value={c.id}>
													{c.name}
												</option>
											))}
										</select>
										<input
											className="input input-bordered w-full"
											type="text"
											name="message"
											placeholder="Type your message here..."
										/>
									</div>
									<button className="btn btn-primary w-full" type="submit">
										Send Message
									</button>
								</form>
							</>
						) : (
							<div className="flex justify-center flex-col items-center">
								<h2 className="card-title text-3xl font-bold mb-6">
									No Slack Access
								</h2>
								<p className="text-center text-base-content/70 mb-8">
									Please connect your Slack account in{' '}
									<Link href="/settings">settings</Link> to post messages.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</Authenticator>
	)
}

export default ProtectedSecondary
