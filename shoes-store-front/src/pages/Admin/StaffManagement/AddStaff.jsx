import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import {
	Avatar,
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	IconButton,
	Input,
	Typography,
} from '@material-tailwind/react'
import { useRef, useState } from 'react'

const AddStaff = ({ open, handleClose, handleAddStaff }) => {
	const fileRef = useRef(null)
	const [imagePresentation, setImagePresentation] = useState('')
	const [imageFile, setImageFile] = useState(null)
	const [values, setValues] = useState({
		image: '',
		accountName: '',
		accountEmail: '',
		password: '',
		gender: '',
		birthday: '',
		phone: '',
		accountAddress: '',
	})
	const [errors, setErrors] = useState({
		image: '',
		accountName: '',
		accountEmail: '',
		password: '',
		gender: '',
		birthday: '',
		phone: '',
		accountAddress: '',
	})

	const handleValueChange = (e) => {
		const { name, value } = e.target
		setValues((prev) => ({ ...prev, [name]: value }))
		setErrors((prev) => ({ ...prev, [name]: '' }))
	}

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (!file) return
		const reader = new FileReader()
		reader.readAsDataURL(file)

		reader.onload = () => {
			setValues((prev) => ({
				...prev,
				image: file.name,
			}))
			setImageFile(file)
			setImagePresentation(reader.result)
			setErrors((prev) => ({ ...prev, image: '' }))
		}
	}

	const removeImage = () => {
		setValues((prev) => ({ ...prev, image: '' }))
		setImageFile(null)
		setImagePresentation('')
	}

	const validate = () => {
		const newErrors = {}

		if (!values.accountEmail) {
			newErrors.accountEmail = 'Email is required.'
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.accountEmail)) {
			newErrors.accountEmail = 'Invalid email format.'
		}

		if (!values.phone) {
			newErrors.phone = 'Phone number is required.'
		} else if (!/^\d{10}$/.test(values.phone.trim())) {
			newErrors.phone = 'Phone number must be 10 digits.'
		}

		if (!values.gender) {
			newErrors.gender = 'Gender is required.'
		} else if (!['male', 'female'].includes(values.gender)) {
			newErrors.gender = 'Gender must be either male or female.'
		}

		if (!values.accountName) newErrors.accountName = 'Account name is required.'
		if (!values.password) newErrors.password = 'Password is required.'
		if (!values.birthday) newErrors.birthday = 'Birthday is required.'
		if (!values.accountAddress) newErrors.accountAddress = 'Address is required.'
		if (!imageFile) newErrors.image = 'Avatar is required.'

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAdd = () => {
		if (validate()) {
			const formData = new FormData()
			formData.append('Avatar', imageFile)
			formData.append('AccountName', values.accountName)
			formData.append('AccountEmail', values.accountEmail)
			formData.append('Password', values.password)
			formData.append('Gender', values.gender)
			formData.append('Birthday', values.birthday)
			formData.append('Phone', values.phone)
			formData.append('AccountAddress', values.accountAddress)
			handleAddStaff(formData)
			handleClose()
		}
	}

	return (
		<Dialog open={open} handler={handleClose} size='lg' className='rounded-md'>
			<DialogHeader className='flex justify-between items-center'>
				<Typography variant='h5' className='font-semibold'>
					Add Staff
				</Typography>
				<IconButton size='sm' onClick={handleClose}>
					<XMarkIcon className='h-5 w-5 text-gray-700' />
				</IconButton>
			</DialogHeader>
			<DialogBody className='space-y-4 flex flex-col'>
				<div className='flex gap-6 items-center'>
					<div className='flex flex-col items-center gap-2'>
						<Typography className='font-semibold'>Avatar</Typography>
						<div className='flex items-center justify-center flex-col'>
							{imagePresentation ? (
								<div className='relative w-24 h-24 flex items-center justify-center'>
									<Avatar
										src={imagePresentation}
										alt='Uploaded Image'
										className='w-full h-full object-cover'
									/>
									<XMarkIcon
										className='absolute top-1 left-16 bg-white border border-gray-300 text-gray-700 cursor-pointer z-10 p-1 rounded-full'
										onClick={removeImage}
									/>
								</div>
							) : (
								<div
									className='flex items-center justify-center w-24 h-24 border border-gray-300 border-dashed rounded-full cursor-pointer'
									onClick={() => fileRef.current.click()}
								>
									<PlusIcon className='h-6 w-6 text-gray-400' />
								</div>
							)}
							<input
								ref={fileRef}
								type='file'
								accept='image/*'
								hidden
								onChange={handleImageChange}
							/>
							{errors.image && <Typography color='red'>{errors.image}</Typography>}
						</div>
					</div>

					<div className='flex-1 mt-12'>
						<Input
							label='Account Name'
							name='accountName'
							value={values.accountName}
							onChange={handleValueChange}
							required
						/>
						{errors.accountName && <Typography color='red'>{errors.accountName}</Typography>}
					</div>

					<div className='flex-1 mt-12'>
						<label className='block mb-2 font-medium'>Gender</label>
						<div className='flex gap-4'>
							<label className='flex items-center'>
								<input
									type='radio'
									name='gender'
									value='male'
									checked={values.gender === 'male'}
									onChange={handleValueChange}
								/>
								<span className='ml-2'>Male</span>
							</label>
							<label className='flex items-center'>
								<input
									type='radio'
									name='gender'
									value='female'
									checked={values.gender === 'female'}
									onChange={handleValueChange}
								/>
								<span className='ml-2'>Female</span>
							</label>
						</div>
						{errors.gender && <Typography color='red'>{errors.gender}</Typography>}
					</div>
				</div>

				<div>
					<Input
						label='Account Email'
						name='accountEmail'
						value={values.accountEmail}
						onChange={handleValueChange}
						required
					/>
					{errors.accountEmail && <Typography color='red'>{errors.accountEmail}</Typography>}
				</div>
				<div>
					<Input
						label='Password'
						name='password'
						value={values.password}
						onChange={handleValueChange}
						required
					/>
					{errors.password && <Typography color='red'>{errors.password}</Typography>}
				</div>
				<div className='flex gap-4'>
					<div className='flex-1'>
						<Input
							label='Phone Number'
							name='phone'
							value={values.phone}
							onChange={handleValueChange}
							required
						/>
						{errors.phone && <Typography color='red'>{errors.phone}</Typography>}
					</div>

					<div className='flex-1'>
						<Input
							label='Birthday'
							name='birthday'
							type='date'
							value={values?.birthday}
							onChange={handleValueChange}
							required
						/>
						{errors.birthday && <Typography color='red'>{errors.birthday}</Typography>}
					</div>
				</div>

				<div>
					<Input
						label='Account Address'
						name='accountAddress'
						value={values.accountAddress}
						onChange={handleValueChange}
						textarea
						rows={3}
						required
					/>
					{errors.accountAddress && <Typography color='red'>{errors.accountAddress}</Typography>}
				</div>
			</DialogBody>
			<DialogFooter className='space-x-4'>
				<Button variant='text' color='gray' onClick={handleClose}>
					Cancel
				</Button>
				<Button variant='gradient' color='blue' onClick={handleAdd}>
					Add
				</Button>
			</DialogFooter>
		</Dialog>
	)
}

export default AddStaff
