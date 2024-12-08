import { Button } from '@material-tailwind/react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
	const navigate = useNavigate()

	return (
		<nav class='bg-white border-gray-200 dark:bg-gray-900' style={{ height: 'max(10vh, 50px)' }}>
			<div class='max-w-screen-xl flex flex-wrap items-center justify-between m-auto h-full'>
				<a
					onClick={() => navigate('/')}
					href='#'
					class='cursor-pointer flex items-center space-x-3 rtl:space-x-reverse'
				>
					<span class='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
						Shoes Store
					</span>
				</a>
				<div class='flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse'>
					<Button onClick={() => (window.location.href = '/auth/login')}>Login</Button>
				</div>
				<div
					class='items-center justify-between hidden w-full md:flex md:w-auto md:order-1'
					id='navbar-user'
				>
					<ul class='flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700'>
						<li>
							<a
								onClick={() => navigate('/')}
								class='block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
							>
								Home
							</a>
						</li>
						<li>
							<a
								onClick={() => navigate('/product')}
								class='block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
							>
								Product
							</a>
						</li>
						<li>
							<a
								onClick={() => navigate('/about')}
								class='block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
							>
								About
							</a>
						</li>
						<li>
							<a
								onClick={() => navigate('/contact')}
								class='block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
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

export default Header
