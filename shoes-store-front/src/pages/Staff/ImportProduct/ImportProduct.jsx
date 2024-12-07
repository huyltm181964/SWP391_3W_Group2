import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Input,
	Typography,
} from '@material-tailwind/react'
import { useState } from 'react'
import LocationSelector from 'src/components/LocationSelector/LocationSelector '

const ImportProduct = ({ open, handleClose, handleImport, existingVariantId }) => {
	const [values, setValues] = useState({
		quantity: '',
		importPrice: '',
		addressDetail: '',
		city: '',
		district: '',
		ward: '',
	})

	const [errors, setErrors] = useState({
		quantity: '',
		importPrice: '',
		addressDetail: '',
		city: '',
		district: '',
		ward: '',
	})

	const handleValueChange = (e) => {
		const { name, value } = e.target
		setValues((prev) => ({ ...prev, [name]: value }))
		setErrors((prev) => ({ ...prev, [name]: '' }))
	}

	const validate = () => {
		const newErrors = {}

		if (!values.quantity) {
			newErrors.quantity = 'Quantity is required.'
		} else if (!Number.isInteger(Number(values.quantity))) {
			newErrors.quantity = 'Quantity must be an integer.'
		} else if (Number(values.quantity) <= 0) {
			newErrors.quantity = 'Quantity must be a positive integer.'
		}

		if (!values.importPrice) {
			newErrors.importPrice = 'Price is required.'
		} else if (Number(values.importPrice) <= 0) {
			newErrors.importPrice = 'Price must be a positive number.'
		}

		if (!values.addressDetail) {
			newErrors.addressDetail = 'Address detail is required.'
		}

		if (!values.city) {
			newErrors.city = 'City is required.'
		}

		if (!values.district) {
			newErrors.district = 'District is required.'
		}

		if (!values.ward) {
			newErrors.ward = 'Ward is required.'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAdd = () => {
		if (validate()) {
			const formData = new FormData()
			formData.append('VariantID', existingVariantId)
			formData.append('Quantity', values.quantity)
			formData.append('ImportPrice', values.importPrice)
			formData.append('AddressDetail', values.addressDetail)
			formData.append('City', values.city)
			formData.append('District', values.district)
			formData.append('Ward', values.ward)

			handleImport(formData)
			handleClose()
		}
	}

	return (
		<Dialog open={open} handler={handleClose} size='lg' className='rounded-md'>
			<DialogHeader className='flex justify-between items-center'>
				<Typography variant='h5' className='font-semibold'>
					Import Product
				</Typography>
			</DialogHeader>
			<DialogBody className='space-y-4 flex flex-col'>
				<div className='flex justify-between'>
					<div className='w-full pr-4'>
						<Input
							label='Quantity'
							name='quantity'
							type='number'
							value={values.quantity}
							onChange={handleValueChange}
							required
							error={!!errors.quantity}
						/>
						{errors.quantity && (
							<Typography variant='small' color='red'>
								{errors.quantity}
							</Typography>
						)}
					</div>
					<div className='w-full'>
						<Input
							label='Import Price'
							name='importPrice'
							type='number'
							value={values.importPrice}
							onChange={handleValueChange}
							required
							error={!!errors.importPrice}
						/>
						{errors.importPrice && (
							<Typography variant='small' color='red'>
								{errors.importPrice}
							</Typography>
						)}
					</div>
				</div>
				<div>
					<Input
						label='Address Detail'
						name='addressDetail'
						value={values.addressDetail}
						onChange={handleValueChange}
						required
						error={!!errors.addressDetail}
					/>
					{errors.addressDetail && (
						<Typography variant='small' color='red'>
							{errors.addressDetail}
						</Typography>
					)}
				</div>

				<LocationSelector values={values} setValues={setValues} errors={errors} />
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

export default ImportProduct
