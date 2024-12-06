import { HeartIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	IconButton,
	Typography,
} from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import Confirmation from 'src/components/Confirmation/Confirmation'
import { ProductManagementService } from 'src/services/Admin/ProductManagementService'
import { VariantManagementService } from 'src/services/Admin/VariantManagementService'
import { GetImage } from 'src/utils/GetImage'
import AddVariant from './AddVariant'
import UpdateVariant from './UpdateVariant'

const TABLE_HEAD = [
	{ head: 'VariantID', customeStyle: '!text-left w-[10%]', key: 'id' },
	{ head: 'Image', customeStyle: 'text-left w-[10%]', key: 'image' },
	{ head: 'Size', customeStyle: 'text-right w-[15%]', key: 'size' },
	{ head: 'Color', customeStyle: 'text-right w-[15%]', key: 'color' },
	{ head: 'Quantity', customeStyle: 'text-right w-[15%]', key: 'quantity' },
	{ head: 'Selling Status', customeStyle: 'text-right w-[15%]', key: 'isStopSelling' },
	{ head: 'Actions', customeStyle: 'text-right w-[15%]', key: 'actions' },
]

const ProductVariant = ({ open, handleClose, product }) => {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [sortColumn, setSortColumn] = useState(null)
	const [sortDirection, setSortDirection] = useState('asc')
	const [openAddPage, setOpenAddPage] = useState(false)
	const [openUpdatePage, setOpenUpdatePage] = useState(false)
	const [tableRows, setTableRows] = useState([])
	const [productId, setProductId] = useState()
	const [selectedVariant, setSelectedVariant] = useState(null)

	useEffect(() => {
		setTableRows(product.productVariants)
		setProductId(product)
	}, [open])

	const sanitizeNumeric = (value) => parseFloat(value.replace(/[^0-9.-]+/g, '') || 0)

	const sortedRows = [...tableRows].sort((a, b) => {
		if (!sortColumn) return 0

		let valueA = a[sortColumn]
		let valueB = b[sortColumn]

		if (sortColumn === 'price' || sortColumn === 'quantity') {
			valueA = sanitizeNumeric(valueA)
			valueB = sanitizeNumeric(valueB)
		} else {
			valueA = String(valueA).toLowerCase()
			valueB = String(valueB).toLowerCase()
		}

		return sortDirection === 'asc'
			? valueA > valueB
				? 1
				: valueA < valueB
				? -1
				: 0
			: valueA < valueB
			? 1
			: valueA > valueB
			? -1
			: 0
	})

	const totalPages = Math.ceil(sortedRows.length / rowsPerPage)
	const paginatedRows = sortedRows.slice(
		page * rowsPerPage,
		Math.min((page + 1) * rowsPerPage, sortedRows.length)
	)

	const handleSort = (key) => {
		setSortDirection((prev) => (sortColumn === key ? (prev === 'asc' ? 'desc' : 'asc') : 'asc'))
		setSortColumn(key)
	}

	const handleChangePage = (newPage) => {
		if (newPage >= 0 && newPage < totalPages) setPage(newPage)
	}

	const renderPageNumbers = () => {
		const pageNumbers = []
		for (let i = 0; i < totalPages; i++) {
			pageNumbers.push(
				<Button
					key={i}
					onClick={() => handleChangePage(i)}
					variant={page === i ? 'filled' : 'text'}
					size='sm'
				>
					{i + 1}
				</Button>
			)
		}
		return pageNumbers
	}

	const handleAddVariant = async (formData) => {
		const data = await VariantManagementService.ADD_VARIANT(formData)

		if (data) {
			const updatedData = await ProductManagementService.GET_DETAIL(product.productID)
			setTableRows(updatedData.productVariants)
			setOpenAddPage(false)
		}
	}

	const handleOpenUpdate = (variant) => {
		setSelectedVariant(variant)
		setOpenUpdatePage(true)
	}

	const handleUpdateVariant = async (formData) => {
		const data = await VariantManagementService.UPDATE_VARIANT(formData)
		if (data) {
			const updatedData = await ProductManagementService.GET_DETAIL(product.productID)
			setTableRows(updatedData.productVariants)
			selectedVariant(null)
			setOpenUpdatePage(false)
		}
	}

	const handleRemoveVariant = async (variantId) => {
		const data = await VariantManagementService.DELETE_VARIANT(variantId)
		if (data) {
			const updatedData = await ProductManagementService.GET_DETAIL(product.productID)
			setTableRows(updatedData.productVariants)
		}
	}

	return (
		<Dialog open={open} handler={handleClose} size='lg'>
			<DialogHeader>
				<Typography variant='h4'>Variant Management</Typography>
			</DialogHeader>
			<DialogBody divider className=' max-h-[80vh] overflow-auto'>
				<div className='flex justify-between mb-4'>
					<Button onClick={() => setOpenAddPage(true)}>Add Variant</Button>
					{openAddPage && (
						<AddVariant
							open={openAddPage}
							handleClose={() => setOpenAddPage(false)}
							handleAddVariant={handleAddVariant}
							idProduct={productId.productID}
						/>
					)}
				</div>
				<table className='w-full table-fixed mt-4'>
					<thead>
						<tr>
							{TABLE_HEAD.map(({ head, customeStyle, key }) => (
								<th
									key={head}
									className={`border-b border-gray-300 !p-4 pb-8 ${customeStyle}`}
									onClick={() => handleSort(key)}
								>
									<Typography
										color='blue-gray'
										variant='small'
										className='!font-bold cursor-pointer'
									>
										{head} {sortColumn === key ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
									</Typography>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{paginatedRows.map((row) => (
							<tr className={`border-gray-300 ${row.isStopSelling ? 'bg-red-100' : ''}`}>
								<td className='p-4'>{row.variantID}</td>
								<td className='p-4 '>
									<img
										className='aspect-square object-cover'
										src={GetImage(row.variantImg)}
										alt='row.variantImg'
									/>
								</td>
								<td className='p-4 text-right'>{row.variantSize}</td>
								<td className='p-4 text-right'>{row.variantColor}</td>
								<td
									className='p-4 text-right'
									style={{
										color: row.variantQuantity === 0 ? 'red' : 'inherit',
									}}
								>
									{row.variantQuantity}
								</td>
								<td className='p-4 text-right'>{row.isStopSelling ? 'No' : 'Yes'}</td>

								<td className='p-4 text-right'>
									<div className='flex justify-end gap-4'>
										<IconButton
											title='Update'
											variant='text'
											size='sm'
											onClick={() => handleOpenUpdate(row)}
										>
											<PencilIcon className='h-5 w-5 text-gray-900' />
										</IconButton>

										<Confirmation
											title='Are you sure?'
											description='Do you really want to delete this item?'
											handleConfirm={() => handleRemoveVariant(row.variantID)}
										>
											{(handleOpen) => (
												<IconButton title='Delete' onClick={handleOpen} variant='text' size='sm'>
													<TrashIcon className='h-5 w-5 text-gray-900' />
												</IconButton>
											)}
										</Confirmation>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{openUpdatePage && selectedVariant && (
					<UpdateVariant
						open={openUpdatePage}
						handleClose={() => setOpenUpdatePage(false)}
						existingVariant={selectedVariant}
						handleUpdateVariant={handleUpdateVariant}
					/>
				)}
				<div className='flex justify-between items-center mt-4'>
					<Button
						onClick={() => handleChangePage(page - 1)}
						disabled={page === 0}
						size='sm'
						aria-label='Previous Page'
					>
						&lt;
					</Button>
					<div className='flex items-center'>{renderPageNumbers()}</div>
					<Button
						onClick={() => handleChangePage(page + 1)}
						disabled={page >= totalPages - 1}
						size='sm'
						aria-label='Next Page'
					>
						&gt;
					</Button>
				</div>
			</DialogBody>
			<DialogFooter>
				<Button variant='text' onClick={handleClose}>
					Close
				</Button>
			</DialogFooter>
		</Dialog>
	)
}

export default ProductVariant
