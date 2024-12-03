import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import {
	Avatar,
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Input,
	Typography,
} from '@material-tailwind/react'
import { useEffect, useRef, useState } from 'react'

const AddVariant = ({ open, handleClose, handleAddVariant, idProduct }) => {
	const fileRef = useRef(null)
	const [imagePresentation, setImagePresentation] = useState('')
	const [imageFile, setImageFile] = useState(null)
	const [idValue, setIdValue] = useState({
		id: '',
	})

	useEffect(() => {
		if (idProduct) {
			setIdValue({
				id: idProduct || '',
			})
		}
	}, [idProduct])

	const [values, setValues] = useState({
		image: '',
		size: '',
		color: '',
	})

	const [errors, setErrors] = useState({
		size: '',
		color: '',
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
		if (!values.size) newErrors.size = 'Size is required.'
		if (!values.color) newErrors.color = 'Color is required.'
		if (!imageFile) newErrors.image = 'Image is required.'

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAdd = () => {
		if (validate()) {
			const formData = new FormData()
			formData.append('ProductID', idValue.id)
			formData.append('VariantImage', imageFile)
			formData.append('VariantSize', values.size)
			formData.append('VariantColor', values.color)
			handleAddVariant(formData)
			handleClose()
		}
	}

	return (
		<Dialog open={open} handler={handleClose} size='lg' className='rounded-md'>
			<DialogHeader className='flex justify-between items-center'>
				<Typography variant='h5' className='font-semibold'>
					Add Variant
				</Typography>
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
						label='Size'
						name='size'
						value={values.size}
						onChange={handleValueChange}
						className='focus:ring focus:ring-gray-300'
						required
						error={!!errors.size}
					/>
					{errors.size && <Typography color='red'>{errors.size}</Typography>}
				</div>
				<div>
					<Input
						label='Color'
						name='color'
						value={values.color}
						onChange={handleValueChange}
						required
						error={!!errors.color}
					/>
					{errors.color && <Typography color='red'>{errors.color}</Typography>}
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

export default AddVariant
