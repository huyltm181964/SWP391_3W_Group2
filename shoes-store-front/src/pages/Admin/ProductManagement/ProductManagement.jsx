import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import {
	Button,
	Card,
	CardBody,
	IconButton,
	Input,
	Tab,
	Typography,
} from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import Confirmation from 'src/components/Confirmation/Confirmation'
import CrudTabs from 'src/components/CrudTabs/CrudTabs'
import { ProductManagementService } from 'src/services/Admin/ProductManagementService'
import { categoriesTab } from 'src/utils/EnumList'
import { GetImage } from 'src/utils/GetImage'
import AddProduct from './AddProduct'
import UpdateProduct from './UpdateProduct'

const TABLE_HEAD = [
	{
		head: 'ID',
		customeStyle: '!text-left w-[7%]',
		key: 'productID',
	},
	{
		head: 'Image',
		customeStyle: '!text-left w-[13%]',
		key: 'image',
	},
	{
		head: 'Name',
		customeStyle: '!text-right w-[20%]',
		key: 'productName',
	},
	{
		head: 'Price',
		customeStyle: 'text-right w-[15%]',
		key: 'productPrice',
	},
	{
		head: 'Category',
		customeStyle: 'text-right w-[15%]',
		key: 'productCategory',
	},
	{
		head: 'Description',
		customeStyle: 'text-left w-[15%]',
		key: 'productDescription',
	},
	{
		head: 'Status',
		customeStyle: 'text-right w-[10%]',
		key: 'productStatus',
	},
	{
		head: 'Actions',
		customeStyle: 'text-right w-[15%]',
		key: 'actions',
	},
]

function ProductManagement() {
	const [tableRows, setTableRows] = useState([])
	const [categoryTab, setCategoryTab] = useState(0)
	const [filteredRows, setFilteredRows] = useState([...tableRows])
	const [searchTerm, setSearchTerm] = useState('')
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [sortColumn, setSortColumn] = useState(null)
	const [sortDirection, setSortDirection] = useState('asc')
	const [openAddPage, setOpenAddPage] = useState(false)
	const [openUpdatePage, setOpenUpdatePage] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState(null)

	useEffect(() => {
		async function fetchProducts() {
			const data = await ProductManagementService.GET_ALL()
			if (data) {
				setTableRows(data)
			}
		}
		fetchProducts()
	}, [openAddPage, openUpdatePage])

	useEffect(() => {
		let filteredData = tableRows
		if (categoriesTab[categoryTab] !== 'All') {
			filteredData = filteredData.filter(
				(row) => row.productCategory === categoriesTab[categoryTab]
			)
		}

		if (searchTerm) {
			filteredData = filteredData.filter((row) =>
				row.productName.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		setFilteredRows(filteredData)
	}, [searchTerm, categoryTab, tableRows])

	const sanitizeNumeric = (value) => parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0

	const sortedRows = filteredRows.slice().sort((a, b) => {
		if (!sortColumn) return 0

		let valueA = a[sortColumn] ?? ''
		let valueB = b[sortColumn] ?? ''

		if (['price', 'variant'].includes(sortColumn)) {
			valueA = sanitizeNumeric(valueA)
			valueB = sanitizeNumeric(valueB)
		} else {
			valueA = String(valueA).toLowerCase()
			valueB = String(valueB).toLowerCase()
		}

		if (sortDirection === 'asc') return valueA > valueB ? 1 : valueA < valueB ? -1 : 0
		return valueA < valueB ? 1 : valueA > valueB ? -1 : 0
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
		if (newPage >= 0 && newPage < totalPages) {
			setPage(newPage)
		}
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

	const handleOpenUpdate = (product) => {
		setSelectedProduct(product)
		setOpenUpdatePage(true)
	}

	const handleAddProduct = async (formData) => {
		const data = await ProductManagementService.ADD_PRODUCT(formData)
		if (data) {
			const updatedData = await ProductManagementService.GET_ALL()
			setTableRows(updatedData)
			setOpenAddPage(false)
		}
	}

	const handleUpdateProduct = async (formData) => {
		const data = await ProductManagementService.UPDATE_PRODUCT(formData)
		if (data) {
			const updatedData = await ProductManagementService.GET_ALL()
			setTableRows(updatedData)
			setSelectedProduct(null)
			setOpenUpdatePage(false)
		}
	}

	const handleRemoveProduct = async (productId) => {
		const data = await ProductManagementService.DELETE_PRODUCT(productId)
		if (data) {
			const updatedData = await ProductManagementService.GET_ALL()
			setTableRows(updatedData)
		}
	}

	return (
		<section className='m-10'>
			<Card className='h-full w-full'>
				<CardBody>
					<div className='rounded-none flex flex-wrap gap-4 justify-between mb-4'>
						<div>
							<Typography variant='h3' color='blue-gray'>
								Product Management
							</Typography>
							<Button onClick={() => setOpenAddPage(true)}>Add Product</Button>
							{openAddPage && (
								<AddProduct
									open={openAddPage}
									handleClose={() => setOpenAddPage(false)}
									handleAddProduct={handleAddProduct}
								/>
							)}
						</div>
						<div className='flex items-center w-full shrink-0 gap-4 md:w-max'>
							<Input
								size='lg'
								label='Search'
								icon={<MagnifyingGlassIcon className='h-5 w-5' />}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>
					<CrudTabs value={categoryTab} handleChange={setCategoryTab}>
						{categoriesTab.map((category, index) => (
							<Tab key={index} label={category}></Tab>
						))}
					</CrudTabs>

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
							{paginatedRows.map((row) => {
								return (
									<tr
										className={`border-gray-300 ${
											row.productStatus === 'Out of business' ? 'bg-red-100' : ''
										}`}
									>
										<td className='p-4'>{row.productID}</td>
										<td className='p-4'>
											<img
												style={{
													width: '120px',
													height: '100px',
													objectFit: 'contain',
												}}
												src={GetImage(row.productImg)}
												alt='Product Image'
											/>
										</td>
										<td className='p-4 text-right'>{row.productName}</td>
										<td className='p-4 text-right'>{row.productPrice}</td>
										<td className='p-4 text-right'>{row.productCategory}</td>
										<td className='p-4 break-words whitespace-normal'>{row.productDescription}</td>
										<td
											className='p-4 text-right'
											style={{
												color: row.productStatus === 'Out of business' ? 'red' : 'inherit',
											}}
										>
											{row.productStatus}
										</td>
										<td className='p-4 text-right'>
											{row.productStatus !== 'Out of business' && (
												<div className='flex justify-end gap-4'>
													<IconButton
														variant='text'
														size='sm'
														onClick={() => handleOpenUpdate(row)}
													>
														<PencilIcon className='h-5 w-5 text-gray-900' />
													</IconButton>
													<Confirmation
														title='Are you sure?'
														description='Do you really want to delete this item?'
														handleConfirm={() => handleRemoveProduct(row.productID)}
													>
														{(handleOpen) => (
															<IconButton onClick={handleOpen} variant='text' size='sm'>
																<TrashIcon className='h-5 w-5 text-gray-900' />
															</IconButton>
														)}
													</Confirmation>
												</div>
											)}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>

					{openUpdatePage && selectedProduct && (
						<UpdateProduct
							open={openUpdatePage}
							handleClose={() => setOpenUpdatePage(false)}
							existingProduct={selectedProduct}
							handleUpdateProduct={handleUpdateProduct}
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

					<div className='mt-4'>
						<label>
							Rows per page:
							<select
								value={rowsPerPage}
								onChange={(e) => setRowsPerPage(Number(e.target.value))}
								className='ml-2 border rounded-md p-1'
							>
								{[5, 10, 25].map((size) => (
									<option key={size} value={size}>
										{size}
									</option>
								))}
							</select>
						</label>
					</div>
				</CardBody>
			</Card>
		</section>
	)
}

export default ProductManagement
