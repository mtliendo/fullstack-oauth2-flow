import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import Home from './pages/Home.tsx'
import Secondary from './pages/Secondary.tsx'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/secondary" element={<Secondary />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	</StrictMode>
)
