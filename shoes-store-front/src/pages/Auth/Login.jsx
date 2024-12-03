import React from 'react'

import { Button, Card, CardBody, CardHeader, Input, Typography } from '@material-tailwind/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import { AuthService } from 'src/services/AuthService'
import { AuthRequest } from 'src/requests/AuthRequest'
import { useGoogleLogin } from '@react-oauth/google'

function Login() {
	const [formBody, setFormBody] = useState({
		accountEmail: '',
		password: '',
	})

	const navigate = useNavigate()

	const handleChangeValue = (e) => {
		const { name, value } = e.target
		setFormBody((prev) => ({ ...prev, [name]: value }))
	}

	const handleLogin = async (e) => {
		e.preventDefault()
		const response = await AuthService.LOGIN(formBody)
		if (response.success) {
			var { token, role, status } = response.data
			if (status.toLowerCase() === 'blocked') {
				enqueueSnackbar('Your account is blocked due to violating our term of service', {
					variant: 'error',
				})
				return
			} else if (status.toLowerCase() === 'inactive') {
				enqueueSnackbar('Active your account before login', { variant: 'error' })

				const requestData = {
					URL: AuthRequest.ACTIVE_ACCOUNT,
					formBody: formBody.accountEmail,
					accountEmail: formBody.accountEmail,
					otp: await AuthService.SEND_MAIL(formBody.accountEmail),
					expirationTime: Date.now() + 1000 * 60 * 5,
				}

				localStorage.setItem('requestData', JSON.stringify(requestData))
				navigate('/auth/otp')
				return
			}
			localStorage.setItem('token', token)
			localStorage.setItem('role', role)
			window.dispatchEvent(new Event('storage'))
			if (role == 'User') {
				navigate('/')
			} else if (role == 'Admin') {
				navigate('/dashboard')
			} else {
				navigate('/auth/login')
			}
		}
	}

	const handleLoginWithGoogle = useGoogleLogin({
		onSuccess: async (res) => {
			const profile = await AuthService.GET_GOOGLE_PROFILE(res.access_token)

			const formBody = { email: profile.email, name: profile.name }
			const response = await AuthService.LOGIN_WITH_GOOGLE(formBody)
			if (response?.success) {
				var { token, role, status } = response.data
				if (status.toLowerCase() === 'blocked') {
					enqueueSnackbar('Your account is blocked due to violating our term of service', {
						variant: 'error',
					})
					return
				} else if (status.toLowerCase() === 'inactive') {
					enqueueSnackbar('Active your account before login', { variant: 'error' })

					const requestData = {
						URL: AuthRequest.ACTIVE_ACCOUNT,
						formBody: formBody.accountEmail,
						accountEmail: formBody.accountEmail,
						otp: await AuthService.SEND_MAIL(formBody.accountEmail),
						expirationTime: Date.now() + 1000 * 60 * 5,
					}

					localStorage.setItem('requestData', JSON.stringify(requestData))
					navigate('/auth/otp')
					return
				}

				localStorage.setItem('token', token)
				localStorage.setItem('role', role)
				window.dispatchEvent(new Event('storage'))
				if (role == 'User') {
					navigate('/')
				} else if (role == 'Admin') {
					navigate('/dashboard')
				} else {
					navigate('/auth/login')
				}
			}
		},
	})

	return (
		<section className='px-8'>
			<div className='container mx-auto h-screen grid place-items-center'>
				<Card shadow={false} className='md:px-24 md:py-6 py-6 border border-gray-300'>
					<CardHeader shadow={false} floated={false} className='text-center'>
						<Typography variant='h1' color='blue-gray' className='mb-4 !text-3xl lg:text-4xl'>
							Welcome to Shoes Store
						</Typography>
						<Typography className='!text-gray-600 text-[18px] font-normal md:max-w-sm'>
							Step into style and comfort with the finest collection of shoes for every occasion.
						</Typography>
					</CardHeader>
					<CardBody>
						<form onSubmit={handleLogin} className='flex flex-col gap-4'>
							<div>
								<label htmlFor='email'>
									<Typography variant='small' color='blue-gray' className='block font-medium mb-2'>
										Email
									</Typography>
								</label>
								<Input
									id='email'
									color='gray'
									size='lg'
									type='email'
									name='accountEmail'
									required
									value={formBody.accountEmail}
									onChange={handleChangeValue}
									placeholder='name@mail.com'
									className='w-full placeholder:opacity-100 border-t-black-200 focus:border-t-black'
									labelProps={{
										className: 'hidden',
									}}
								/>
							</div>
							<div>
								<label htmlFor='password'>
									<Typography variant='small' color='blue-gray' className='block font-medium mb-2'>
										Password
									</Typography>
								</label>
								<Input
									id='password'
									color='gray'
									size='lg'
									type='password'
									name='password'
									placeholder='password'
									required
									value={formBody.password}
									onChange={handleChangeValue}
									className='w-full placeholder:opacity-100  border-t-black-200 focus:border-t-black'
									labelProps={{
										className: 'hidden',
									}}
								/>
							</div>
							<Button
								onClick={() => navigate('/auth/forgot-password')}
								size='sm'
								variant='text'
								color='blue'
								style={{ width: 'max-content', marginLeft: 'auto' }}
							>
								Forgot Password?
							</Button>
							<Button type='submit' size='lg' color='blue' fullWidth>
								continue
							</Button>
							<div className='flex items-center justify-center gap-1'>
								<Typography>Don't have any account?</Typography>
								<Button className='p-2' variant='text' onClick={() => navigate('/auth/register')}>
									Register here
								</Button>
							</div>
							<Button
								variant='outlined'
								size='lg'
								onClick={handleLoginWithGoogle}
								className='flex h-12 border-blue-gray-200 items-center justify-center gap-2'
								fullWidth
							>
								<img
									src={`https://www.material-tailwind.com/logos/logo-google.png`}
									alt='google'
									className='h-6 w-6'
								/>{' '}
								sign in with google
							</Button>
							<Typography
								variant='small'
								className='text-center mx-auto max-w-[19rem] !font-medium !text-gray-600'
							>
								Upon signing in, you consent to abide by our{' '}
								<a href='#' className='text-gray-900'>
									Terms of Service
								</a>{' '}
								&{' '}
								<a href='#' className='text-gray-900'>
									Privacy Policy.
								</a>
							</Typography>
						</form>
					</CardBody>
				</Card>
			</div>
		</section>
	)
}

export default Login
