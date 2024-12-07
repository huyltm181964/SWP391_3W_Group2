import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Input,
	Typography,
} from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import LocationSelector from 'src/components/LocationSelector/LocationSelector '

const UpdateImportProduct = ({ open, handleClose, existingImportProduct, handleUpdateImport }) => {
	const [values, setValues] = useState({
		importId: '',
		importPrice: '',
		addressDetail: '',
		city: '',
		district: '',
		ward: '',
	})

	useEffect(() => {
		if (existingImportProduct) {
			const location = existingImportProduct.location.split(',').map((part) => part.trim())

			const city = location[0] || ''
			const district = location[1] || ''
			const ward = location[2] || ''
			const addressDetail = location.slice(3).join(', ') || ''

			console.log('city: ', city)
			console.log('district: ', district)
			console.log('ward: ', ward)
			setValues({
				importId: existingImportProduct.id || '',
				importPrice: existingImportProduct.unitPrice || '',
				addressDetail: addressDetail,
				city: city,
				district: district,
				ward: ward,
			})
		}
	}, [existingImportProduct])

	const [errors, setErrors] = useState({
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

		if (!values.importPrice) {
			newErrors.importPrice = 'Import Price is required.'
		} else if (isNaN(Number(values.importPrice)) || Number(values.importPrice) <= 0) {
			newErrors.importPrice = 'Import Price must be a positive number.'
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

	const handleUpdate = () => {
		if (validate()) {
			const formData = new FormData()
			formData.append('ImportID', values.importId)
			formData.append('ImportPrice', values.importPrice)
			formData.append('AddressDetail', values.addressDetail)
			formData.append('City', values.city)
			formData.append('District', values.district)
			formData.append('Ward', values.ward)

			handleUpdateImport(formData)
			handleClose()
		}
	}

	return (
		<Dialog open={open} handler={handleClose} size='lg' className='rounded-md'>
			<DialogHeader className='flex justify-between items-center'>
				<Typography variant='h5' className='font-semibold'>
					Update Import Product
				</Typography>
			</DialogHeader>
			<DialogBody className='space-y-4 flex flex-col'>
				<Input label='Import ID' name='importId' value={values.importId} readOnly required />
				<div className='flex justify-between'>
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
				<Button variant='gradient' color='blue' onClick={handleUpdate}>
					Update
				</Button>
			</DialogFooter>
		</Dialog>
	)
}

export default UpdateImportProduct
