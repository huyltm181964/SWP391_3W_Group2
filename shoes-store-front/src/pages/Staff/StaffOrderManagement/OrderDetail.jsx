import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Typography,
} from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import Confirmation from 'src/components/Confirmation/Confirmation'
import { ExportProductService, StaffOrderService } from 'src/services/Staff/StaffOrderService'
import { GetImage } from 'src/utils/GetImage'

const TABLE_HEAD = [
	{ head: 'Variant ID', customeStyle: '!text-left w-[12.5%]', key: 'variantID' },
	{ head: 'Product', customeStyle: 'text-left w-[25%]', key: 'image' },
	{ head: 'Variant Size', customeStyle: 'text-left w-[12.5%]', key: 'image' },
	{ head: 'Variant Color', customeStyle: 'text-left w-[12.5%]', key: 'image' },
	{ head: 'Quantity', customeStyle: 'text-right w-[12.5%]', key: 'quantity' },
	{ head: 'Unit Price', customeStyle: 'text-right w-[12.5%]', key: 'color' },
	{ head: 'Total Price', customeStyle: 'text-right w-[12.5%]', key: 'color' },
]

const OrderDetail = ({ open, handleClose, order, orderDetailData }) => {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [sortColumn, setSortColumn] = useState(null)
	const [sortDirection, setSortDirection] = useState('asc')
	const [tableRows, setTableRows] = useState([])

	useEffect(() => {
		setTableRows(orderDetailData)
	}, [open, orderDetailData])

	useEffect(() => {
		if (tableRows.length > 0 && tableRows.every((row) => row.isExported)) {
			handleClose()
		}
	}, [tableRows, handleClose])

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

	const handleConfirmOrder = async (orderID) => {
		await StaffOrderService.CONFIRM_ORDER(orderID)
		handleClose()
	}

	const handleCompleteOrder = async (orderID) => {
		await StaffOrderService.COMPLETE_ORDER(orderID)
		handleClose()
	}

	return (
		<Dialog open={open} handler={handleClose} size='lg'>
			<DialogHeader>
				<Typography variant='h4'>Order Detail of Order ID: {order.orderID}</Typography>
			</DialogHeader>
			<DialogBody divider className=' max-h-[80vh] overflow-auto'>
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
						{paginatedRows.map((row) =>
							!row.isExported ? (
								<tr className='border-gray-300' key={row.variantID}>
									<td className='p-4'>{row.variantID}</td>
									<td className='p-4 flex gap-2'>
										<img
											className='aspect-square object-cover w-[25%]'
											src={GetImage(row.variant.product.productImg)}
											alt={row.variant.variantImg}
										/>
										<p>{row.variant.product.productName}</p>
									</td>
									<td className='p-4 text-right'>{row.variant.variantSize}</td>
									<td className='p-4 text-right'>{row.variant.variantColor}</td>
									<td className='p-4 text-right'>{row.quantity}</td>
									<td className='p-4 text-right'>${row.unitPrice}</td>
									<td className='p-4 text-right'>${row.unitPrice * row.quantity}</td>
								</tr>
							) : null
						)}
					</tbody>
				</table>

				{order.orderStatus.toLowerCase() === 'ordered' ? (
					<Confirmation
						title='Are you sure?'
						description='Do you really want to confirm this order?'
						handleConfirm={() => handleConfirmOrder(order.orderID)}
					>
						{(handleOpen) => (
							<Button className='w-full' color='blue' onClick={handleOpen} variant='contained'>
								Confirm order
							</Button>
						)}
					</Confirmation>
				) : order.orderStatus.toLowerCase() === 'confirmed' ? (
					<Confirmation
						title='Are you sure?'
						description='Do you really want to set this order as completed?'
						handleConfirm={() => handleCompleteOrder(order.orderID)}
					>
						{(handleOpen) => (
							<Button className='w-full' color='green' onClick={handleOpen} variant='contained'>
								Set as completed
							</Button>
						)}
					</Confirmation>
				) : null}

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

export default OrderDetail
