import { Button, Typography } from '@material-tailwind/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from 'src/services/AuthService'
import axiosFormBody from 'src/utils/axiosFormBody'

const OTP = () => {
	const inputRefs = useRef([])
	const [otp, setOtp] = useState(Array(4).fill(''))
	const [countdown, setCountdown] = useState(0)
	const [requestData, setRequestData] = useState({
		URL: null,
		formBody: null,
		accountEmail: null,
		otp: null,
		expirationTime: null,
	})

	const navigate = useNavigate()

	useEffect(() => {
		if (!localStorage.getItem('requestData')) {
			navigate('/auth/login')
		}

		setRequestData(JSON.parse(localStorage.getItem('requestData')))

		return () => localStorage.removeItem('requestData')
	}, [])

	useEffect(() => {
		if (countdown > 0) {
			const timerId = setTimeout(() => setCountdown(countdown - 1), 1000)
			return () => clearTimeout(timerId)
		}
	}, [countdown])

	const handleKeyDown = (e, index) => {
		if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
			e.preventDefault()
		}

		if (e.key === 'Backspace' || e.key === 'Delete') {
			if (index > 0) {
				setOtp((prevOtp) => {
					const newOtp = [...prevOtp]
					newOtp[index - 1] = ''
					return newOtp
				})
				inputRefs.current[index - 1].focus()
			}
		}
	}

	const handleInput = (e, index) => {
		const value = e.target.value
		if (!/^[0-9]$/.test(value)) return

		setOtp((prevOtp) => {
			const newOtp = [...prevOtp]
			newOtp[index] = value
			return newOtp
		})

		if (index < otp.length - 1) {
			inputRefs.current[index + 1].focus()
		}
	}

	const handlePaste = (e) => {
		e.preventDefault()
		const text = e.clipboardData.getData('text')
		if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) return

		const digits = text.split('')
		setOtp(digits)

		if (digits.length === otp.length) {
			inputRefs.current[otp.length - 1].focus()
		}
	}

	const handleResendOtp = async (event) => {
		event.preventDefault()

		const otp = await AuthService.SEND_MAIL(requestData.accountEmail)
		const expirationTime = Date.now() + 1000 * 60 * 5
		setCountdown(60)
		setRequestData((prev) => ({
			...prev,
			otp: otp,
			expirationTime: expirationTime,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (
			Object.values(requestData).some((value) => !value) ||
			requestData.expirationTime < Date.now()
		) {
			enqueueSnackbar('OTP is invalid or expired', {
				variant: 'error',
				autoHideDuration: 1000,
			})
			localStorage.removeItem('requestData')
			navigate('/auth/login')
			return
		}

		const otpSubmit = otp.join('')
		if (otpSubmit.toString() !== requestData.otp.toString()) {
			enqueueSnackbar('OTP is incorrect. Please try again', { variant: 'error' })
			return
		}

		const data = await axiosFormBody
			.post(requestData.URL, requestData.formBody)
			.then((response) => response)
		console.log(data)
		if (data.success) {
			enqueueSnackbar('Success', { variant: 'success' })
			setTimeout(() => {
				navigate('/auth/login')
			}, 1000)
		}
	}

	return (
		<main className='relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden'>
			<div className='w-full max-w-6xl mx-auto px-4 md:px-6 py-24'>
				<div className='flex justify-center'>
					<div className='max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow'>
						<header className='mb-8'>
							<h1 className='text-2xl font-bold mb-1'>Email Verification</h1>
							<p className='text-[15px] text-slate-500'>
								Enter the 4-digit verification code that was sent to your email.
							</p>
						</header>
						<form onSubmit={handleSubmit}>
							<div className='flex items-center justify-center gap-3'>
								{otp.map((_, index) => (
									<input
										key={index}
										type='text'
										className='w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-blue-gray-200 hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
										maxLength='1'
										value={otp[index]}
										ref={(el) => (inputRefs.current[index] = el)}
										onKeyDown={(e) => handleKeyDown(e, index)}
										onInput={(e) => handleInput(e, index)}
										onFocus={(e) => e.target.select()}
										onPaste={handlePaste}
									/>
								))}
							</div>
							<div className='max-w-[260px] mx-auto mt-4'>
								<button
									type='submit'
									className='w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150'
								>
									Verify Account
								</button>
							</div>
						</form>
						<div className='text-sm text-slate-500 mt-4'>
							Didn't receive code?{' '}
							{countdown > 0 ? (
								<Typography className='inline font-bold'>{countdown}s</Typography>
							) : (
								<Button onClick={handleResendOtp} variant='text'>
									Resend
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default OTP
