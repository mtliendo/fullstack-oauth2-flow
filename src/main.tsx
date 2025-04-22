import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import Home from './pages/Home.tsx'
import Secondary from './pages/Secondary.tsx'
import Settings from './pages/Settings.tsx'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
import { Amplify } from 'aws-amplify'
import awsconfig from '../amplify_outputs.json'
import { Authenticator } from '@aws-amplify/ui-react'

Amplify.configure(awsconfig)

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Authenticator.Provider>
			<BrowserRouter>
				<div className="flex flex-col h-screen">
					<Navbar />
					<div className="flex-grow">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/secondary" element={<Secondary />} />
							<Route path="/settings" element={<Settings />} />
						</Routes>
					</div>
					<Footer />
				</div>
			</BrowserRouter>
		</Authenticator.Provider>
	</StrictMode>
)
