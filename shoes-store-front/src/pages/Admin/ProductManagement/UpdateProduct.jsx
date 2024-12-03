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
import { useEffect, useRef, useState } from 'react'
import { categoriesList } from 'src/utils/EnumList'
import { GetImage } from 'src/utils/GetImage'

const UpdateProduct = ({ open, handleClose, existingProduct, handleUpdateProduct }) => {
	const fileRef = useRef(null)
	const [imagePresentation, setImagePresentation] = useState(null)
	const [imageFile, setImageFile] = useState(null)
	const [errors, setErrors] = useState({})
	const [values, setValues] = useState({
		id: '',
		image: '',
		name: '',
		price: '',
		description: '',
		category: '',
	})

	useEffect(() => {
		if (existingProduct) {
			setValues({
				id: existingProduct.productID || '',
				image: existingProduct.productImg || '',
				name: existingProduct.productName || '',
				price: existingProduct.productPrice?.toString() || '',
				description: existingProduct.productDescription || '',
				category: existingProduct.productCategory || '',
			})
		}
	}, [existingProduct])

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
		if (!imageFile && !values.image) newErrors.image = 'Image is required.'

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleUpdate = () => {
		if (validate()) {
			const formData = new FormData()
			formData.append('ProductID', values.id)
			formData.append('ProductImg', imageFile)
			formData.append('ProductName', values.name)
			formData.append('ProductDescription', values.description)
			formData.append('ProductPrice', parseFloat(values.price))
			formData.append('ProductCategory', values.category)
			handleUpdateProduct(formData)
			handleClose()
		}
	}

	return (
		<Dialog open={open} handler={handleClose} size='lg' className='rounded-md'>
			<DialogHeader className='flex justify-between items-center'>
				<Typography variant='h5' className='font-semibold'>
					Update Product
				</Typography>
			</DialogHeader>
			<DialogBody className='space-y-4 flex flex-col'>
				<div className='flex flex-col gap-4'>
					<Typography className='font-semibold'>Image</Typography>
					<div className='flex items-center justify-center flex-col gap-4 '>
						{values.image || imagePresentation ? (
							<div className='relative w-24 h-24 flex items-center justify-center'>
								<Avatar
									src={imagePresentation ? imagePresentation : GetImage(values.image)}
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
						{errors.image && <Typography color='red'>{errors.image}</Typography>}
						<input ref={fileRef} type='file' accept='image/*' hidden onChange={handleImageChange} />
					</div>
				</div>
				<Input
					readOnly
					label='ID'
					name='id'
					value={values.id}
					onChange={handleValueChange}
					className='focus:ring focus:ring-gray-300'
				/>
				<Input
					label='Name'
					name='name'
					value={values.name}
					onChange={handleValueChange}
					className='focus:ring focus:ring-gray-300'
					error={Boolean(errors.name)}
					helperText={errors.name}
				/>
				<Input
					label='Price'
					name='price'
					type='number'
					value={values.price}
					onChange={handleValueChange}
					error={Boolean(errors.price)}
					helperText={errors.price}
				/>
				<select
					className='w-full border border-gray-300 rounded-md px-3 py-2'
					name='category'
					value={values.category}
					onChange={handleValueChange}
				>
					<option value=''>Select Category</option>
					{categoriesList.map((category, index) => (
						<option key={index} value={category}>
							{category}
						</option>
					))}
				</select>
				{errors.category && <Typography color='red'>{errors.category}</Typography>}
				<Input
					label='Description'
					name='description'
					value={values.description}
					onChange={handleValueChange}
					textarea
					rows={3}
					error={Boolean(errors.description)}
					helperText={errors.description}
				/>
			</DialogBody>
			<DialogFooter className='space-x-4'>
				<Button variant='text' color='gray' onClick={handleClose}>
					Cancel
				</Button>
				<Button variant='gradient' color='blue' onClick={handleUpdate}>
					Update
				</Button>
			</DialogFooter>
		</Dialog>
	)
}

export default UpdateProduct
