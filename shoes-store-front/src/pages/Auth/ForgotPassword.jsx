import { Button } from '@material-tailwind/react'
import { enqueueSnackbar } from 'notistack'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthRequest } from 'src/requests/User/AuthRequest'
import { AuthService } from 'src/services/User/AuthService'
import { GetLogo } from 'src/utils/GetImage'

const ForgotPassword = () => {
	const [accountEmail, setAccountEmail] = useState('')

	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!accountEmail) {
			enqueueSnackbar('Please enter your email to reset its password', { variant: 'error' })
			return
		}

		const requestData = {
			URL: AuthRequest.FORGOT_PASSWORD,
			formBody: accountEmail,
			accountEmail: accountEmail,
			otp: await AuthService.SEND_MAIL(accountEmail),
			expirationTime: Date.now() + 1000 * 60 * 5,
		}

		localStorage.setItem('requestData', JSON.stringify(requestData))
		navigate('/auth/otp')
	}

	return (
		<section className='bg-gray-50 dark:bg-gray-900'>
			<div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
				<a
					href='#'
					className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'
				>
					<img className='w-8 h-8 mr-2' src={GetLogo()} alt='logo' />
					Shoes store
				</a>
				<div className='w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl dark:bg-gray-800 dark:border-gray-700 sm:p-20'>
					<h1 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
						Forgot your password?
					</h1>
					<p className='font-light text-gray-500 dark:text-gray-400'>
						Don't fret! Just type in your email and we will send you a code to reset your password!
					</p>
					<form className='mt-4 space-y-4 lg:mt-5 md:space-y-5' onSubmit={handleSubmit}>
						<div>
							<label
								for='email'
								className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
							>
								Your email
							</label>
							<input
								type='email'
								name='email'
								id='email'
								value={accountEmail}
								onChange={(e) => setAccountEmail(e.target.value)}
								className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
								placeholder='name@mail.com'
								required
							/>
						</div>
						<Button type='submit' size='lg' color='blue' fullWidth>
							Reset Password
						</Button>
					</form>
				</div>
			</div>
		</section>
	)
}

export default ForgotPassword
