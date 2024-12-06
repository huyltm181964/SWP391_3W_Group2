import React from 'react'

import { Button, Card, CardBody, CardHeader, Input, Typography } from '@material-tailwind/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import { AuthService } from 'src/services/User/AuthService'
import { AuthRequest } from 'src/requests/User/AuthRequest'

function Register() {
	const [formBody, setFormBody] = useState({
		accountEmail: '',
		password: '',
		firstName: '',
		lastName: '',
		phone: '',
	})

	const navigate = useNavigate()

	const handleChangeValue = (e) => {
		const { name, value } = e.target
		setFormBody((prev) => ({ ...prev, [name]: value }))
	}

	const handleRegister = async (e) => {
		e.preventDefault()

		const { firstName, lastName, ...rest } = formBody
		const formBodyWithAccountName = {
			...rest,
			accountName: `${lastName} ${firstName}`,
		}

		const data = await AuthService.REGISTER(formBodyWithAccountName)
		if (!data.success) {
			return
		}

		enqueueSnackbar(data.message, { variant: 'success' })

		const otp = await AuthService.SEND_MAIL(formBody.accountEmail)
		const requestData = {
			URL: AuthRequest.ACTIVE_ACCOUNT,
			formBody: formBody.accountEmail,
			accountEmail: formBody.accountEmail,
			otp: otp,
			expirationTime: Date.now() + 1000 * 60 * 5,
		}

		localStorage.setItem('requestData', JSON.stringify(requestData))
		setInterval(() => {
			navigate('/auth/otp')
		}, 3000)
	}

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
						<form onSubmit={handleRegister} className='flex flex-col gap-4'>
							<div className='flex justify-between gap-2'>
								<div>
									<label htmlFor='firstName'>
										<Typography
											variant='small'
											color='blue-gray'
											className='block font-medium mb-2'
										>
											First Name
										</Typography>
									</label>
									<Input
										id='firstName'
										color='gray'
										size='lg'
										type='text'
										required
										name='firstName'
										value={formBody.firstName}
										onChange={handleChangeValue}
										placeholder='first name'
										className='w-full placeholder:opacity-100 border-t-black-200 focus:border-t-black'
										labelProps={{
											className: 'hidden',
										}}
									/>
								</div>
								<div>
									<label htmlFor='lastName'>
										<Typography
											variant='small'
											color='blue-gray'
											className='block font-medium mb-2'
										>
											Last Name
										</Typography>
									</label>
									<Input
										id='lastName'
										color='gray'
										size='lg'
										type='text'
										required
										name='lastName'
										value={formBody.lastName}
										onChange={handleChangeValue}
										placeholder='last name'
										className='w-full placeholder:opacity-100 border-t-black-200 focus:border-t-black'
										labelProps={{
											className: 'hidden',
										}}
									/>
								</div>
							</div>
							<div>
								<label htmlFor='phone'>
									<Typography variant='small' color='blue-gray' className='block font-medium mb-2'>
										Phone
									</Typography>
								</label>
								<Input
									id='phone'
									color='gray'
									size='lg'
									name='phone'
									required
									pattern='\d{10,11}'
									title='Phone must be 10 or 11 digits'
									value={formBody.phone}
									onChange={handleChangeValue}
									placeholder='0123456789'
									className='w-full placeholder:opacity-100 border-t-black-200 focus:border-t-black'
									labelProps={{
										className: 'hidden',
									}}
								/>
							</div>
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
									required
									placeholder='password'
									value={formBody.password}
									onChange={handleChangeValue}
									className='w-full placeholder:opacity-100  border-t-black-200 focus:border-t-black'
									labelProps={{
										className: 'hidden',
									}}
								/>
							</div>
							<Button type='submit' size='lg' color='deep-purple' fullWidth>
								Register
							</Button>
							<div className='flex items-center justify-center gap-1'>
								<Typography>Already have an account?</Typography>
								<Button className='p-2' variant='text' onClick={() => navigate('/auth/login')}>
									Login Now
								</Button>
							</div>
						</form>
					</CardBody>
				</Card>
			</div>
		</section>
	)
}

export default Register
