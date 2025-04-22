import { Link } from 'react-router'
import ThemeController from './ThemeController'
import { useAuthenticator } from '@aws-amplify/ui-react'

function Navbar() {
	const { user, signOut } = useAuthenticator((context) => [context.user])
	return (
		<div className="navbar bg-base-100 shadow-sm w-full">
			<div className="navbar-start">
				<Link to="/" className="btn btn-ghost text-xl">
					Slack App Oauth2
				</Link>
			</div>

			<div className="navbar-end">
				<div className="flex flex-row gap-2">
					{user ? (
						<div className="dropdown dropdown-end">
							<div tabIndex={0} role="button" className="btn btn-primary">
								Profile
							</div>
							<ul
								tabIndex={0}
								className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
							>
								<li>
									<Link to="/settings">Settings</Link>
								</li>
								<div className="divider" />
								<li className="text-sm text-gray-500 text-center my-2">
									{user.signInDetails?.loginId}
								</li>
								<li>
									<button className="btn btn-error" onClick={signOut}>
										Sign Out
									</button>
								</li>
							</ul>
						</div>
					) : (
						<Link to="/secondary" className="btn btn-primary">
							Login
						</Link>
					)}
					<ThemeController />
				</div>
			</div>
		</div>
	)
}

export default Navbar
