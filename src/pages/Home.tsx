import { Link } from 'react-router'

function Home() {
	return (
		<div className="min-h-screen bg-base-200">
			{/* Hero Section */}
			<div className="hero min-h-[60vh] bg-base-200">
				<div className="hero-content text-center">
					<div className="max-w-2xl">
						<h1 className="text-5xl font-bold mb-6">
							Slack Integration Made Simple
						</h1>
						<p className="text-xl mb-8">
							Connect your Slack workspace and start sending messages directly
							from your dashboard. Manage your integration with ease and keep
							your team connected.
						</p>
						<div className="flex gap-4 justify-center">
							<Link to="/secondary" className="btn btn-primary">
								Send a Message
							</Link>
							<Link to="/settings" className="btn btn-outline">
								Manage Settings
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="py-16 px-4">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl font-bold text-center mb-12">Features</h2>
					<div className="grid md:grid-cols-3 gap-8">
						{/* Feature 1 */}
						<div className="card bg-base-100 shadow-xl">
							<div className="card-body">
								<div className="flex justify-center mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-12 w-12 text-primary"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
										/>
									</svg>
								</div>
								<h3 className="card-title text-center mb-2">
									Direct Messaging
								</h3>
								<p className="text-center">
									Send messages directly to your Slack workspace from your
									dashboard.
								</p>
							</div>
						</div>

						{/* Feature 2 */}
						<div className="card bg-base-100 shadow-xl">
							<div className="card-body">
								<div className="flex justify-center mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-12 w-12 text-primary"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								</div>
								<h3 className="card-title text-center mb-2">
									Secure Connection
								</h3>
								<p className="text-center">
									Your Slack connection is secure and managed through OAuth2
									authentication.
								</p>
							</div>
						</div>

						{/* Feature 3 */}
						<div className="card bg-base-100 shadow-xl">
							<div className="card-body">
								<div className="flex justify-center mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-12 w-12 text-primary"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								</div>
								<h3 className="card-title text-center mb-2">Easy Management</h3>
								<p className="text-center">
									Connect and disconnect your Slack account with just a few
									clicks.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="py-16 bg-primary text-primary-content">
				<div className="max-w-4xl mx-auto text-center px-4">
					<h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
					<p className="text-xl mb-8">
						Connect your Slack workspace now and start sending messages in
						minutes.
					</p>
					<Link to="/settings" className="btn btn-secondary">
						Connect Slack
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Home
