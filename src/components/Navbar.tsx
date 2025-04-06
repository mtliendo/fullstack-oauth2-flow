import { Link } from 'react-router'
import ThemeController from './ThemeController'
function Navbar() {
	return (
		<div className="navbar bg-base-100 shadow-sm w-full">
			<div className="navbar-start">
				<Link to="/" className="btn btn-ghost text-xl">
					Starter
				</Link>
			</div>

			<div className="navbar-end">
				<div className="flex flex-row gap-2">
					<Link to="/secondary" className="btn btn-primary">
						Login
					</Link>
					<ThemeController />
				</div>
			</div>
		</div>
	)
}

export default Navbar
