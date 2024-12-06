import { Card } from '@material-tailwind/react'
import { enqueueSnackbar } from 'notistack'
import React, { useState } from 'react'
import { AccountService } from 'src/services/User/AccountService'

const ChangePasswordForm = () => {
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (newPassword !== confirmPassword) {
			enqueueSnackbar('Confirm Password not matched', { variant: 'error' })
			return
		}

		const formData = new FormData()
		formData.append('oldPassword', oldPassword)
		formData.append('newPassword', newPassword)
		const data = await AccountService.CHANGE_PASSWORD(formData)
		if (data?.success) {
			enqueueSnackbar('Change password successfully', { variant: 'success' })
			setOldPassword('')
			setNewPassword('')
			setConfirmPassword('')
		}
	}

	return (
		<Card>
			<form onSubmit={handleSubmit} class='w-full px-6 pb-8 mt-8'>
				<h2 class='text-2xl mb-4 font-bold sm:text-xl'>Change Password</h2>

				<div class='mb-2 sm:mb-6'>
					<label
						for='oldPass'
						class='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'
					>
						Old Password
					</label>
					<input
						id='oldPass'
						type='password'
						class='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
						placeholder='your old password'
						value={oldPassword}
						onChange={(e) => setOldPassword(e.target.value)}
						required
					/>
				</div>
				<div class='mb-2 sm:mb-6'>
					<label
						for='newPass'
						class='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'
					>
						New Password
					</label>
					<input
						id='newPass'
						type='password'
						class='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
						placeholder='your new password'
						required
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
				</div>
				<div class='mb-2 sm:mb-6'>
					<label
						for='conPass'
						class='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'
					>
						Confirm Password
					</label>
					<input
						id='conPass'
						type='password'
						class='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
						placeholder='reconfirm your new password'
						required
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				<div class='flex justify-end'>
					<button
						type='submit'
						class='text-white bg-purple-700  hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800'
					>
						Change Password
					</button>
				</div>
			</form>
		</Card>
	)
}

export default ChangePasswordForm
