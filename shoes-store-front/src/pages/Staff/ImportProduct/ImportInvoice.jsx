import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Typography,
} from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { ImportProductService } from 'src/services/Staff/ImportProductService'
import { GetImage } from 'src/utils/GetImage'

const TABLE_HEAD = [
	{ head: 'Product ID', customeStyle: 'text-center w-[10%]', key: 'productID' },
	{ head: 'Image', customeStyle: 'text-center w-[20%]', key: 'productImg' },
	{ head: 'Product Name', customeStyle: 'text-center w-[20%]', key: 'productName' },
	{ head: 'Size', customeStyle: 'text-center w-[10%]', key: 'size' },
	{ head: 'Color', customeStyle: 'text-center w-[10%]', key: 'color' },
	{ head: 'Quantity', customeStyle: 'text-center w-[10%]', key: 'quantity' },
	{ head: 'Unit Price', customeStyle: 'text-center w-[10%]', key: 'unitPrice' },
	{ head: 'Total Price', customeStyle: 'text-center w-[10%]', key: 'totalPrice' },
]

const ImportInvoice = ({ open, handleClose, existingImport }) => {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [sortColumn, setSortColumn] = useState(null)
	const [sortDirection, setSortDirection] = useState('asc')
	const [tableRows, setTableRows] = useState([])

	useEffect(() => {
		setTableRows(existingImport)
	}, [open])
	const sanitizeNumeric = (value) => parseFloat(String(value).replace(/[^0-9.-]+/g, '') || 0)
	const importID = tableRows[0]?.importID || 'N/A'
	const staffID = tableRows[0]?.staffID || 'N/A'
	const staffName = tableRows[0]?.staffName || 'N/A'

	const sortedRows = [...tableRows].sort((a, b) => {
		if (!sortColumn) return 0

		let valueA = a[sortColumn]
		let valueB = b[sortColumn]

		if (sortColumn === 'quantity') {
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

	return (
		<Dialog open={open} handler={handleClose} size='lg'>
			<DialogHeader>
				<Typography variant='h4'>
					Import Invoice of {importID} | Staff ID: {staffID} | Staff Name: {staffName}
				</Typography>
			</DialogHeader>
			<DialogBody divider className=' max-h-[80vh] overflow-auto'>
				<table className='w-full table-fixed mt-4'>
					<thead>
						<tr>
							{TABLE_HEAD.map(({ head, customeStyle, key }) => (
								<th
									key={key}
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
						{paginatedRows.map((row, rowIndex) => (
							<tr key={rowIndex} className={`border-gray-300`}>
								<td className='p-4 text-center w-[10%]'>{row.productID}</td>
								<td className='p-4 text-center w-[10%]'>
									<img
										className='aspect-square object-cover'
										src={GetImage(row.productImg)}
										alt='row.productImg'
									/>
								</td>
								<td className='p-4 text-center w-[10%]'>{row.productName}</td>
								<td className='p-4 text-center w-[10%]'>{row.size}</td>
								<td className='p-4 text-center w-[10%]'>{row.color}</td>
								<td className='p-4 text-center w-[10%]'>{row.quantity}</td>
								<td className='p-4 text-center w-[10%]'>{row.unitPrice}</td>
								<td className='p-4 text-center w-[10%]'>{row.totalPrice}</td>
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
				<Button
					variant='text'
					className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600'
					onClick={handleClose}
				>
					Close
				</Button>
			</DialogFooter>
		</Dialog>
	)
}

export default ImportInvoice
