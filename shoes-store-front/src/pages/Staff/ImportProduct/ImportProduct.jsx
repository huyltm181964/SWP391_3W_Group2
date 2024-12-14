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
import { ProductManagementService } from 'src/services/Admin/ProductManagementService'
import { AccountService } from 'src/services/User/AccountService'
import AddProduct from './AddProduct'
import { ImportProductService } from 'src/services/Staff/ImportProductService'

const ImportProduct = ({ open, handleClose, handleImport }) => {
	const [profile, setProfile] = useState([])
	const [openAddPage, setOpenAddPage] = useState(false)
	const [product, setProduct] = useState()
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
			const productData = await ImportProductService.GET_ALL_PRODUCTS()
			if (productData) {
				setProduct(productData)
				console.log(productData)
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
			newErrors.supplier = 'Supplier name is required. Please enter the supplier name.'
		}
		if (!values.phone) {
			newErrors.phone = 'Phone number is required. Please provide a valid phone number.'
		} else if (!/^\d{10}$/.test(values.phone)) {
			newErrors.phone = 'Phone number must be exactly 10 digits.'
		}
		if (!values.addressDetail) {
			newErrors.addressDetail = 'Address detail is required. Please fill in the address.'
		}
		if (!values.city) {
			newErrors.city = 'City is required. Please select a city.'
		}
		if (!values.district) {
			newErrors.district = 'District is required. Please select a district.'
		}
		if (!values.ward) {
			newErrors.ward = 'Ward is required. Please select a ward.'
		}
		if (values.variantDetails.length === 0) {
			newErrors.variantDetails = 'At least one variant detail is required. Add a product variant.'
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

		handleImport(formBody)

		handleClose()
	}
	const handleAddProduct = async (formData) => {
		await ImportProductService.ADD_PRODUCT(formData)
		const data = await ImportProductService.GET_ALL_PRODUCTS()
		if (data) {
			setProduct(data)
		}

		setOpenAddPage(false)
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
				{errors.supplier && <div className='text-red-500 text-sm'>{errors.supplier}</div>}

				<Input
					label='Phone'
					name='phone'
					value={values.phone}
					onChange={handleValueChange}
					error={!!errors.phone}
				/>
				{errors.phone && <div className='text-red-500 text-sm'>{errors.phone}</div>}
				<div className='flex gap-4'>
					<div className='flex-1 flex flex-col'>
						<Input
							label='Address Detail'
							name='addressDetail'
							value={values.addressDetail}
							onChange={handleValueChange}
							error={!!errors.addressDetail}
						/>
						{errors.addressDetail && (
							<div className='text-red-500 text-sm mt-1'>{errors.addressDetail}</div>
						)}
					</div>

					<div className='flex-1'>
						<LocationSelector values={values} setValues={setValues} errors={errors} />
					</div>
				</div>

				<div>
					<Typography variant='h6'>Variant Details:</Typography>
					<div className='p-6 bg-gray-50 rounded-lg shadow-md'>
						<div className='mb-6'>
							<Button
								className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
								onClick={() => setOpenAddPage(true)}
							>
								Add Product
							</Button>
							{openAddPage && (
								<AddProduct
									open={openAddPage}
									handleClose={() => setOpenAddPage(false)}
									handleAddProduct={handleAddProduct}
								/>
							)}
						</div>

						<div className='mb-6 border-black'>
							<label htmlFor='productId' className='block text-sm font-medium text-gray-700'>
								Product Name
							</label>
							<select
								id='productId'
								name='productId'
								value={newVariant.productId}
								onChange={handleVariantChange}
								className='block w-full border-gray-300 rounded p-2'
							>
								<option value='' disabled>
									Select a product
								</option>
								{product &&
									product.map((item) => (
										<option key={item.id} value={item.productID}>
											{item.productName}
										</option>
									))}
							</select>
						</div>

						<div className='flex gap-6 p-4 bg-gray-50 rounded-lg shadow-md'>
							<div className='w-full flex flex-col gap-4'>
								<Input
									label='Variant Size'
									name='variantSize'
									value={newVariant.variantSize}
									onChange={handleVariantChange}
									className='w-full border-gray-300 rounded p-2'
								/>
								<Input
									label='Variant Color'
									name='variantColor'
									value={newVariant.variantColor}
									onChange={handleVariantChange}
									className='w-full border-gray-300 rounded p-2'
								/>
							</div>

							<div className='w-full flex flex-col gap-4'>
								<Input
									label='Quantity'
									name='quantity'
									type='number'
									value={newVariant.quantity}
									onChange={handleVariantChange}
									className='w-full border-gray-300 rounded p-2'
								/>
								<Input
									label='Import Price'
									name='importPrice'
									type='number'
									value={newVariant.importPrice}
									onChange={handleVariantChange}
									className='w-full border-gray-300 rounded p-2'
								/>
							</div>
						</div>

						<Button
							className='w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
							onClick={addVariantDetail}
						>
							Add Variant
						</Button>
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
