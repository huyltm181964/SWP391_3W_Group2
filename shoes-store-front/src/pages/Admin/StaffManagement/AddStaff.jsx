import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
	Input,
	Typography,
	IconButton,
	Avatar,
	Radio,
} from '@material-tailwind/react'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid'
import { useState, useRef } from 'react'
import { categoriesList } from 'src/utils/EnumList'

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
		Birthday: '',
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
		if (!values.name) newErrors.name = 'Name is required.'
		if (!values.price) newErrors.price = 'Price is required.'
		if (!values.description) newErrors.description = 'Description is required.'
		if (!values.category) newErrors.category = 'Category is required.'
		if (!imageFile) newErrors.image = 'Image is required.'

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
				<div className='flex flex-col gap-4'>
					<Typography className='font-semibold'>Image</Typography>
					<div className='flex items-center justify-center flex-col gap-4'>
						{imagePresentation ? (
							<div className='relative w-24 h-24 flex items-center justify-center'>
								<Avatar
									src={imagePresentation}
									alt='Uploaded Image'
									variant='rounded'
									className='w-full h-full object-cover'
								/>

								<XMarkIcon
									className='absolute top-1 left-16 bg-white border border-gray-300 text-gray-700 cursor-pointer z-10 p-1 rounded-full'
									onClick={removeImage}
								/>
							</div>
						) : (
							<div
								className='flex items-center justify-center w-24 h-24 border border-gray-300 border-dashed rounded-md cursor-pointer'
								onClick={() => fileRef.current.click()}
							>
								<PlusIcon className='h-6 w-6 text-gray-400' />
							</div>
						)}
						<input ref={fileRef} type='file' accept='image/*' hidden onChange={handleImageChange} />
						{errors.image && <Typography color='red'>{errors.image}</Typography>}
					</div>
				</div>
				<div className='flex gap-10'>
					<div className='w-full'>
						<Input
							label='Account Name'
							name='accountName'
							value={values.accountName}
							onChange={handleValueChange}
							required
						/>
					</div>

					<div className='w-full '>
						<label>Gender</label>
						<div className='flex gap-4'>
							<label className='flex '>
								<input
									type='radio'
									name='gender'
									value='male'
									checked={values.gender === 'male'}
									onChange={handleValueChange}
								/>
								<span className='ml-2'>Male</span>
							</label>

							<label className='flex '>
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
					</div>
				</div>

				<div>
					<Input
						label='AccountEmail'
						name='accountEmail'
						value={values.accountEmail}
						onChange={handleValueChange}
						required
					/>
				</div>
				<div>
					<Input
						label='Password'
						name='password'
						value={values.password}
						onChange={handleValueChange}
						required
					/>
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
					</div>

					<div className='flex-1'>
						<Input
							label='Birthday'
							name='birthday'
							type='date'
							value={values.birthday}
							onChange={handleValueChange}
							required
						/>
					</div>
				</div>

				<div>
					<Input
						label='AccountAddress'
						name='accountAddress'
						value={values.accountAddress}
						onChange={handleValueChange}
						textarea
						rows={3}
						required
					/>
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
