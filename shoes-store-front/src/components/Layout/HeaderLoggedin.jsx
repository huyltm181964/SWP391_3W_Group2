import { Avatar } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountService } from 'src/services/AccountService'
import { AuthService } from 'src/services/AuthService'
import { GetImage } from 'src/utils/GetImage'

const HeaderLoggedin = () => {
	const [open, setOpen] = useState(false)
	const [profile, setProfile] = useState({})

	const navigate = useNavigate()

	useEffect(() => {
		const fetchData = async () => {
			const data = await AccountService.GET_PROFILE()
			if (data) {
				setProfile(data)
			}
		}

		fetchData()
		window.addEventListener('storage', fetchData)
	}, [])

	return (
		<nav
			className='bg-white border-gray-200 dark:bg-gray-900'
			style={{ height: 'max(10vh, 50px)' }}
		>
			<div className='max-w-screen-xl flex flex-wrap items-center justify-between m-auto h-full'>
				<a
					onClick={() => navigate('/')}
					className='cursor-pointer flex items-center space-x-3 rtl:space-x-reverse'
				>
					<span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
						Shoes Store
					</span>
				</a>
				<div className='flex relative items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse'>
					<button
						type='button'
						className='flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
						id='user-menu-button'
						onClick={() => setOpen(!open)}
					>
						<span className='sr-only'>Open user menu</span>
						<Avatar
							size='md'
							variant='circular'
							className='w-8 h-8 rounded-full'
							src={GetImage(profile?.avatar)}
						/>
					</button>
					<div
						className='z-50 absolute text-base list-none divide-y divide-gray-100 rounded-lg shadow bg-gray-100'
						hidden={!open}
						id='user-dropdown'
						style={{ top: '100%', right: '50%' }}
					>
						<div className='px-4 py-3'>
							<span className='block text-sm text-gray-900 dark:text-white'>
								{profile.accountName}
							</span>
							<span className='block text-sm  text-gray-500 truncate dark:text-gray-400'>
								{profile.accountEmail}
							</span>
						</div>
						<ul className='py-2' aria-labelledby='user-menu-button'>
							<li>
								<a
									onClick={() => {
										navigate('/account/profile')
										setOpen(false)
									}}
									className='block px-4 py-2 select-none cursor-pointer text-sm text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
								>
									Profile Settings
								</a>
							</li>
							<li>
								<a
									onClick={() => {
										navigate('/account/cart')
										setOpen(false)
									}}
									className='block px-4 py-2 select-none cursor-pointer text-sm text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
								>
									Cart
								</a>
							</li>
							<li>
								<a
									onClick={() => {
										navigate('/account/history-order')
										setOpen(false)
									}}
									className='block px-4 py-2 select-none cursor-pointer text-sm text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
								>
									History Order
								</a>
							</li>
							<li>
								<a
									onClick={() => AuthService.LOGOUT()}
									className='block px-4 py-2 text-sm select-none cursor-pointer text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
								>
									Sign out
								</a>
							</li>
						</ul>
					</div>
					<button
						data-collapse-toggle='navbar-user'
						type='button'
						className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
						aria-controls='navbar-user'
						aria-expanded='false'
					>
						<span className='sr-only'>Open main menu</span>
						<svg
							className='w-5 h-5'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 17 14'
						>
							<path
								stroke='currentColor'
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d='M1 1h15M1 7h15M1 13h15'
							/>
						</svg>
					</button>
				</div>
				<div
					className='items-center justify-between hidden w-full md:flex md:w-auto md:order-1'
					id='navbar-user'
				>
					<ul className='flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700'>
						<li>
							<a
								href='/'
								className='block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
							>
								Home
							</a>
						</li>
						<li>
							<a
								href='/product'
								className='block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
							>
								Product
							</a>
						</li>
						<li>
							<a
								href='/about'
								className='block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
							>
								About
							</a>
						</li>
						<li>
							<a
								href='/contact'
								className='block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
							>
								Contact
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	)
}

export default HeaderLoggedin
