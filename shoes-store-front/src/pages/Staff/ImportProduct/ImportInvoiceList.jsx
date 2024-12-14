import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
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
import CrudTabs from 'src/components/CrudTabs/CrudTabs'
import { ImportProductService } from 'src/services/Staff/ImportProductService'
import { categoriesTab } from 'src/utils/EnumList'
import { GetImage } from 'src/utils/GetImage'
import VariantList from './VariantList'

const TABLE_HEAD = [
	{
		head: 'ImportID',
		customeStyle: '!text-center w-[10%]',
		key: 'importID',
	},
	{
		head: 'ImportDate',
		customeStyle: '!text-center w-[10%]',
		key: 'importDate',
	},
	{
		head: 'Supplier',
		customeStyle: '!text-center w-[15%]',
		key: 'supplier',
	},
	{
		head: 'ImportLocation',
		customeStyle: 'text-center w-[20%]',
		key: 'importLocation',
	},
	{
		head: 'Supplier Phone',
		customeStyle: 'text-center w-[15%]',
		key: 'phone',
	},
	{
		head: 'Staff Name',
		customeStyle: 'text-center w-[15%]',
		key: 'productDescription',
	},
	{
		head: 'Action',
		customeStyle: 'text-center w-[15%]',
		key: 'viewDetail',
	},
]

function ImportInvoiceList() {
	const [tableRows, setTableRows] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [sortColumn, setSortColumn] = useState(null)
	const [sortDirection, setSortDirection] = useState('asc')
	const [openVariantPage, setOpenVariantPage] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [product, setImportDetail] = useState([])

	useEffect(() => {
		async function fetchImports() {
			const data = await ImportProductService.GET_ALL_PRODUCT()
			if (data) {
				setTableRows(data)
			}
		}
		fetchImports()
	}, [openVariantPage])

	const sanitizeNumeric = (value) => parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0

	const sortedRows = tableRows.slice().sort((a, b) => {
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

	const handleOpenVariant = async (productId) => {
		setSelectedProduct(productId)
		const data = await ImportProductService.GET_PRODUCT_DETAIL(productId)
		if (data) {
			setImportDetail(data)
		}
		setOpenVariantPage(true)
	}

	return (
		<section className='m-10'>
			<Card className='h-full w-full'>
				<CardBody>
					<div className='rounded-none flex flex-wrap gap-4 justify-between mb-4'>
						<div>
							<Typography variant='h3' color='blue-gray'>
								Product List
							</Typography>
						</div>
						<div className='flex items-center w-full shrink-0 gap-4 md:w-max'>
							<Input
								size='lg'
								label='Search'
								icon={<MagnifyingGlassIcon className='h-5 w-5' />}
								value={searchTerm}
								s
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
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
							{paginatedRows.map((row) => {
								return (
									<tr
										key={row.productID}
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
														title='Manage product variant'
														onClick={() => handleOpenVariant(row.productID)}
													>
														<ArrowRightIcon className='h-5 w-5 text-gray-900' />
													</IconButton>
												</div>
											)}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
					{openVariantPage && selectedProduct && (
						<VariantList
							open={openVariantPage}
							handleClose={() => setOpenVariantPage(false)}
							existingProduct={selectedProduct}
							product={product}
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

export default ImportInvoiceList
