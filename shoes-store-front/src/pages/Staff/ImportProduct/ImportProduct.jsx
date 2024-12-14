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
import { AccountService } from 'src/services/User/AccountService'

const ImportProduct = ({ open, handleClose, handleImport }) => {
	const [profile, setProfile] = useState([])
	const [values, setValues] = useState({
		supplier: '',
		phone: '',
		addressDetail: '',
		city: '',
		district: '',
		ward: '',
		variantDetails: [],
	})

	useEffect(() => {
		const fetchData = async () => {
			const data = await AccountService.GET_PROFILE()
			if (data) {
				setProfile(data)
				console.log(data)
			}
		}
		fetchData()
	}, [])

	const [errors, setErrors] = useState({})
	const [newVariant, setNewVariant] = useState({
		productId: '',
		variantSize: '',
		variantColor: '',
		quantity: '',
		importPrice: '',
	})

	const handleValueChange = (e) => {
		const { name, value } = e.target
		setValues((prev) => ({ ...prev, [name]: value }))
		setErrors((prev) => ({ ...prev, [name]: '' }))
	}

	const handleVariantChange = (e) => {
		const { name, value } = e.target
		setNewVariant((prev) => ({ ...prev, [name]: value }))
	}

	const addVariantDetail = () => {
		if (
			!newVariant.productId ||
			!newVariant.quantity ||
			isNaN(newVariant.quantity) ||
			Number(newVariant.quantity) <= 0 ||
			!newVariant.importPrice ||
			isNaN(newVariant.importPrice) ||
			Number(newVariant.importPrice) <= 0
		) {
			alert('Please fill in all required variant fields with valid data.')
			return
		}

		setValues((prev) => ({
			...prev,
			variantDetails: [...prev.variantDetails, { ...newVariant }],
		}))

		setNewVariant({
			productId: '',
			variantSize: '',
			variantColor: '',
			quantity: '',
			importPrice: '',
		})
	}

	const validate = () => {
		const newErrors = {}
		if (!values.supplier) {
			newErrors.supplier = 'Supplier is required.'
		}
		if (!values.phone) {
			newErrors.phone = 'Phone is required.'
		}
		if (values.variantDetails.length === 0) {
			newErrors.variantDetails = 'At least one variant detail is required.'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAdd = async () => {
		if (!validate()) return

		const formBody = {
			supplier: values.supplier,
			phone: values.phone,
			addressDetail: values.addressDetail,
			city: values.city,
			district: values.district,
			ward: values.ward,
			importStaffID: profile.accountID,
			variantDetails: values.variantDetails.map((variant) => ({
				productID: Number(variant.productId),
				variantSize: variant.variantSize,
				variantColor: variant.variantColor,
				quantity: Number(variant.quantity),
				importPrice: Number(variant.importPrice),
			})),
		}
		console.log(formBody)

		handleImport(formBody)

		handleClose()
	}

	return (
		<Dialog open={open} handler={handleClose} size='lg'>
			<DialogHeader>
				<Typography variant='h5'>Import Product</Typography>
			</DialogHeader>
			<DialogBody className='space-y-4'>
				<Input
					label='Supplier'
					name='supplier'
					value={values.supplier}
					onChange={handleValueChange}
					error={!!errors.supplier}
				/>
				<Input
					label='Phone'
					name='phone'
					value={values.phone}
					onChange={handleValueChange}
					error={!!errors.phone}
				/>
				<Input
					label='Address Detail'
					name='addressDetail'
					value={values.addressDetail}
					onChange={handleValueChange}
					required
					error={!!errors.addressDetail}
				/>
				<LocationSelector values={values} setValues={setValues} errors={errors} />
				<div>
					<Typography variant='h6'>Variant Details</Typography>
					<div className='flex p-2'>
						<Input
							label='Product ID'
							name='productId'
							value={newVariant.productId}
							onChange={handleVariantChange}
						/>
						<Input
							label='Variant Size'
							name='variantSize'
							value={newVariant.variantSize}
							onChange={handleVariantChange}
						/>
						<Input
							label='Variant Color'
							name='variantColor'
							value={newVariant.variantColor}
							onChange={handleVariantChange}
						/>
						<Input
							label='Quantity'
							name='quantity'
							type='number'
							value={newVariant.quantity}
							onChange={handleVariantChange}
						/>
						<Input
							label='Import Price'
							name='importPrice'
							type='number'
							value={newVariant.importPrice}
							onChange={handleVariantChange}
						/>
						<Button onClick={addVariantDetail}>Add Variant</Button>
					</div>

					{values.variantDetails.length > 0 && (
						<div className='mt-4'>
							<Typography variant='subtitle1'>Variants Added:</Typography>
							<div className='overflow-x-auto'>
								<table className='table-auto w-full border-collapse border border-gray-200 mt-2'>
									<thead>
										<tr className='bg-gray-100'>
											<th className='border border-gray-300 px-4 py-2 text-left'>Product ID</th>
											<th className='border border-gray-300 px-4 py-2 text-left'>Size</th>
											<th className='border border-gray-300 px-4 py-2 text-left'>Color</th>
											<th className='border border-gray-300 px-4 py-2 text-left'>Quantity</th>
											<th className='border border-gray-300 px-4 py-2 text-left'>Import Price</th>
										</tr>
									</thead>
									<tbody>
										{values.variantDetails.map((variant, index) => (
											<tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
												<td className='border border-gray-300 px-4 py-2'>{variant.productId}</td>
												<td className='border border-gray-300 px-4 py-2'>{variant.variantSize}</td>
												<td className='border border-gray-300 px-4 py-2'>{variant.variantColor}</td>
												<td className='border border-gray-300 px-4 py-2'>
													{variant.quantity} units
												</td>
												<td className='border border-gray-300 px-4 py-2'>${variant.importPrice}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
					{errors.variantDetails && (
						<Typography variant='small' color='red'>
							{errors.variantDetails}
						</Typography>
					)}
				</div>
			</DialogBody>
			<DialogFooter>
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
