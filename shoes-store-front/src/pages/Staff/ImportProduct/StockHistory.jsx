import { PencilIcon } from '@heroicons/react/24/solid'
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
import { ImportProductService } from 'src/services/ImportProductService'
import ImportProduct from './ImportProduct'

const TABLE_HEAD = [
	{ head: 'ID', customeStyle: '!text-left w-[13%]', key: 'id' },
	{ head: 'Date', customeStyle: 'text-left w-[15%]', key: 'date' },
	{ head: 'Address', customeStyle: 'text-center w-[30%]', key: 'location' },
	{ head: 'Quantity', customeStyle: 'text-right w-[10%]', key: 'quantity' },
	{ head: 'UnitPrice', customeStyle: 'text-right w-[10%]', key: 'unitPrice' },
	{ head: 'Total Price', customeStyle: 'text-right w-[12%]', key: 'totalPrice' },
	{ head: 'Actions', customeStyle: 'text-right w-[10%]', key: 'actions' },
]

const StockHistory = ({ open, handleClose, existingVariantId, stockHistoryData }) => {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [sortColumn, setSortColumn] = useState(null)
	const [sortDirection, setSortDirection] = useState('asc')
	const [tableRows, setTableRows] = useState([])
	const [openAddPage, setOpenAddPage] = useState(false)

	useEffect(() => {
		setTableRows(stockHistoryData)
	}, [open])

	const sanitizeNumeric = (value) => parseFloat(String(value).replace(/[^0-9.-]+/g, '') || 0)

	const sortedRows = [...tableRows].sort((a, b) => {
		if (!sortColumn) return 0

		let valueA = a[sortColumn]
		let valueB = b[sortColumn]

		if (sortColumn === 'quantity' || sortColumn === 'unitPrice' || sortColumn === 'totalPrice') {
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

	const handleImport = async (formData) => {
		const data = await ImportProductService.IMPORT_PRODUCT(formData)

		if (data) {
			const variantID = formData.get('VariantID')
			const updatedData = await ImportProductService.GET_STOCK_HISTORY(variantID)
			setTableRows(updatedData)
			setOpenAddPage(false)
		}
	}

	return (
		<Dialog open={open} handler={handleClose} size='lg'>
			<DialogHeader>
				<Typography variant='h4'>Stock History of variant id: {existingVariantId}</Typography>
			</DialogHeader>
			<DialogBody divider className=' max-h-[80vh] overflow-auto'>
				<div className='flex justify-between mb-4'>
					<Button onClick={() => setOpenAddPage(true)}>Import Product</Button>
					{openAddPage && (
						<ImportProduct
							open={openAddPage}
							handleClose={() => setOpenAddPage(false)}
							handleImport={handleImport}
							existingVariantId={existingVariantId}
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
							<tr className={`border-gray-300 `}>
								<td className='p-4'>{row.id}</td>
								<td className='p-4 text-left'>{row.date.split('T')[0]}</td>
								<td className='p-4 text-left break-words whitespace-normal'>{row.location}</td>
								{row.id.includes('Import') ? (
									<td className='p-4 text-right'>+ {row.quantity}</td>
								) : (
									<td className='p-4 text-right'>- {row.quantity}</td>
								)}
								<td className='p-4 text-right'>{row.unitPrice}</td>
								<td className='p-4 text-right'>{row.unitPrice * row.quantity}</td>

								<td className='p-4 text-right'>
									<div className='flex justify-end gap-4'>
										{!row.isStopSelling && (
											<IconButton
												title='Update'
												variant='text'
												size='sm'
												// onClick={() => handleOpenUpdate(row)}
											>
												<PencilIcon className='h-5 w-5 text-gray-900' />
											</IconButton>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>

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

export default StockHistory
