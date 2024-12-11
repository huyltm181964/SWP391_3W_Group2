import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Error404 from './components/Error/Error404'
import Header from './layouts/Header'
import HeaderLoggedin from './layouts/HeaderLoggedin'
import Dashboard from './pages/Admin/Dashboard'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Login from './pages/Auth/Login'
import OTP from './pages/Auth/OTP'
import Register from './pages/Auth/Register'
import Profile from './pages/User/Profile'

import Footer from './layouts/Footer'
import AboutUs from './pages/Guest/AboutUs'
import ContactUs from './pages/Guest/ContactUs'
import Home from './pages/Guest/Home'
import Product from './pages/Guest/Product'
import ProductDetail from './pages/Guest/ProductDetail'
import StaffDashboard from './pages/Staff/StaffDashboard'
import Cart from './pages/User/Cart'
import HistoryOrder from './pages/User/HistoryOrder'
import Payment from './pages/User/Payment'
import { ProtectedRoute, RoleRedirect } from './utils/PrivateRoute'
import HistoryContact from './pages/User/HistoryContact'
import OrderVerify from './pages/User/OrderVerify'

function App() {
	const location = useLocation()

	const [role, setRole] = useState(localStorage.getItem('role'))

	useEffect(() => {
		const handleRoleChange = () => setRole(localStorage.getItem('role'))
		window.addEventListener('storage', handleRoleChange)
		return () => window.removeEventListener('storage', handleRoleChange)
	}, [])

	const renderHeader = () => {
		if (!role) return <Header />
		if (role.toLowerCase() === 'user') return <HeaderLoggedin />
		return null
	}
	return (
		<div className='flex flex-col min-h-screen'>
			{!location.pathname.startsWith('/auth') && renderHeader()}
			<div className='flex-grow'>
				<RoleRedirect role={role}>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/about' element={<AboutUs />} />
						<Route path='/contact' element={<ContactUs />} />

						<Route path='/auth/login' element={<Login />} />
						<Route path='/auth/register' element={<Register />} />
						<Route path='/auth/forgot-password' element={<ForgotPassword />} />
						<Route path='/auth/otp' element={<OTP />} />

						<Route path='/product' element={<Product />} />
						<Route path='/product/:id' element={<ProductDetail />} />

						<Route path='/account/profile' element={<Profile />} />
						<Route path='/account/cart' element={<Cart />} />
						<Route path='/account/history-order' element={<HistoryOrder />} />
						<Route path='/account/history-contact' element={<HistoryContact />} />
						<Route path='/account/payment/:id' element={<Payment />} />

						<Route path='/order/verify' element={<OrderVerify />} />

						<Route
							path='/dashboard'
							element={
								<ProtectedRoute role={role} allowedRole='admin' redirectPath='/'>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path='/staff/dashboard'
							element={
								<ProtectedRoute role={role} allowedRole='staff' redirectPath='/'>
									<StaffDashboard />
								</ProtectedRoute>
							}
						/>

						<Route path='/404' element={<Error404 />} />
						<Route path='*' element={<Error404 />} />
					</Routes>
				</RoleRedirect>
			</div>
			{!location.pathname.startsWith('/auth') && renderHeader() && <Footer />}
		</div>
	)
}

export default App
