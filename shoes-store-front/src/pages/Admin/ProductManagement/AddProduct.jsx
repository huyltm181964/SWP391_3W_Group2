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
import { categoriesList } from 'src/utils/EnumList'

const AddProduct = ({ open, handleClose, handleAddProduct }) => {
	const fileRef = useRef(null)
	const [imagePresentation, setImagePresentation] = useState('')
	const [imageFile, setImageFile] = useState(null)
	const [values, setValues] = useState({
		image: '',
		name: '',
		price: '',
		description: '',
		category: '',
	})
	const [errors, setErrors] = useState({
		name: '',
		price: '',
		description: '',
		category: '',
		image: '',
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
		else if (values.price <= 0) newErrors.price = 'Price must be greater than zero.'
		if (!values.description) newErrors.description = 'Description is required.'
		if (!values.category) newErrors.category = 'Category is required.'
		if (!imageFile) newErrors.image = 'Image is required.'

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAdd = () => {
		if (validate()) {
			const formData = new FormData()
			formData.append('ProductImg', imageFile)
			formData.append('ProductName', values.name)
			formData.append('ProductDescription', values.description)
			formData.append('ProductPrice', parseFloat(values.price))
			formData.append('ProductCategory', values.category)
			handleAddProduct(formData)
			handleClose()
		}
	}

	return (
		<Dialog open={open} handler={handleClose} size='lg' className='rounded-md'>
			<DialogHeader className='flex justify-between items-center'>
				<Typography variant='h5' className='font-semibold'>
					Add Product
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
				<div>
					<Input
						label='Name'
						name='name'
						value={values.name}
						onChange={handleValueChange}
						className='focus:ring focus:ring-gray-300'
						required
						error={!!errors.name}
					/>
					{errors.name && <Typography color='red'>{errors.name}</Typography>}
				</div>
				<div>
					<Input
						label='Price'
						name='price'
						type='number'
						value={values.price}
						onChange={handleValueChange}
						required
						error={!!errors.price}
					/>
					{errors.price && <Typography color='red'>{errors.price}</Typography>}
				</div>
				<div>
					<select
						className='w-full border border-gray-300 rounded-md px-3 py-2'
						name='category'
						value={values.category}
						onChange={handleValueChange}
						required
					>
						<option value=''>Select Category</option>
						{categoriesList.map((category, index) => (
							<option key={index} value={category}>
								{category}
							</option>
						))}
					</select>
					{errors.category && <Typography color='red'>{errors.category}</Typography>}
				</div>
				<div>
					<Input
						label='Description'
						name='description'
						value={values.description}
						onChange={handleValueChange}
						textarea
						rows={3}
						required
						error={!!errors.description}
					/>
					{errors.description && <Typography color='red'>{errors.description}</Typography>}
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

export default AddProduct
