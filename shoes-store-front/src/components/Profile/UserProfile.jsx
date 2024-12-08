import { Card, Radio } from '@material-tailwind/react'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useRef, useState } from 'react'
import { AccountService } from 'src/services/User/AccountService'
import { getDateFromDateTime, getOffsetDate } from 'src/utils/DateUtil'
import { GetImage } from 'src/utils/GetImage'

const UserProfile = () => {
	const [profile, setProfile] = useState({})
	const [imageFile, setImageFile] = useState(null)
	const [imagePresentation, setImagePresentation] = useState(null)

	const imageRef = useRef(null)

	useEffect(() => {
		const fetch = async () => {
			const data = await AccountService.GET_PROFILE()
			if (data) {
				setProfile(data)
			}
		}
		fetch()
	}, [])

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				setImagePresentation(reader.result)
			}
			setImageFile(file)
			reader.readAsDataURL(file)
		}
	}

	const handleChangeValue = (e) => {
		const { name, value } = e.target
		setProfile((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('accountEmail', profile.accountEmail)
		formData.append('avatar', imageFile || null)
		formData.append('accountName', profile.accountName)
		formData.append('gender', profile.gender)
		formData.append('birthDay', profile.birthDay)
		formData.append('phone', profile.phone)
		formData.append('accountAddress', profile.accountAddress)
		const data = await AccountService.UPDATE_PROFILE(formData)
		if (data?.success) {
			window.dispatchEvent(new Event('storage'))
			enqueueSnackbar('Update profile successfully', { variant: 'success' })
		}
	}

	return (
		<Card>
			<div class='w-full px-6 pb-8 mt-8'>
				<h2 class='pl-6 text-2xl font-bold sm:text-xl'>Profile</h2>
				<form onSubmit={handleSubmit} class='grid mx-auto mt-8'>
					<div class='flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0'>
						<img
							alt=''
							class='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500'
							src={imagePresentation ? imagePresentation : GetImage(profile.avatar)}
						/>
						<div class='flex flex-col space-y-5 sm:ml-8'>
							<button
								type='button'
								onClick={() => imageRef.current.click()}
								class='py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 '
							>
								Change picture
							</button>
							<input
								type='file'
								accept='image/*'
								hidden
								ref={imageRef}
								onChange={handleImageChange}
							/>
						</div>
					</div>

					<div class='items-center mt-8 sm:mt-14 text-[#202142]'>
						<div class='flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6'>
							<div class='w-full'>
								<label
									for='name'
									class='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'
								>
									Your name
								</label>
								<input
									type='text'
									id='name'
									name='accountName'
									class='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
									placeholder='Your name'
									value={profile?.accountName}
									onChange={handleChangeValue}
									required
								/>
							</div>

							<div class='w-full'>
								<label
									for='email'
									class='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'
								>
									Your email
								</label>
								<input
									type='email'
									id='email'
									name='accountEmail'
									class='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
									placeholder='your.email@mail.com'
									value={profile?.accountEmail}
									disabled
								/>
							</div>
						</div>

						<div class='mb-2 sm:mb-6'>
							<label
								for='phone'
								class='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'
							>
								Phone
							</label>
							<input
								type='tel'
								id='phone'
								name='phone'
								class='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
								placeholder='your phone'
								pattern='\d{10,11}'
								title='Phone must be 10 or 11 digits'
								value={profile?.phone}
								onChange={handleChangeValue}
								required
							/>
						</div>

						<div class='mb-2 sm:mb-6'>
							<label
								for='birthday'
								class='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'
							>
								Birthday
							</label>
							<input
								type='date'
								id='birthday'
								name='birthDay'
								class='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
								placeholder='your birthday'
								value={getDateFromDateTime(profile?.birthDay)}
								onChange={handleChangeValue}
								max={getOffsetDate(0)}
								required
							/>
						</div>
						<div class='mb-2 sm:mb-6'>
							<label
								for='phone'
								class='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'
							>
								Address
							</label>
							<input
								type='text'
								id='accountAddress'
								name='accountAddress'
								class='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
								placeholder='your address'
								value={profile?.accountAddress}
								onChange={handleChangeValue}
								required
							/>
						</div>

						<div class='mb-2 sm:mb-6'>
							<label class='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'>
								Gender
							</label>
							<div className='flex gap-10'>
								<Radio
									id='gender-male'
									name='gender'
									value={'male'}
									checked={profile?.gender?.toString().toLowerCase() === 'male'}
									onChange={handleChangeValue}
									label='Male'
								/>
								<Radio
									id='gender-female'
									name='gender'
									value={'female'}
									checked={profile?.gender?.toString().toLowerCase() === 'female'}
									onChange={handleChangeValue}
									label='Female'
								/>
								<Radio
									id='gender-null'
									name='gender'
									value={'null'}
									checked={
										!!!profile?.gender || profile?.gender?.toString().toLowerCase() === 'null'
									}
									onChange={handleChangeValue}
									label='Not specified'
								/>
							</div>
						</div>

						<div class='flex justify-end'>
							<button
								type='submit'
								class='text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800'
							>
								Save
							</button>
						</div>
					</div>
				</form>
			</div>
		</Card>
	)
}

export default UserProfile
