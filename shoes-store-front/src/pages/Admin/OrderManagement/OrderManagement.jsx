import { Button, Card, CardBody, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import Confirmation from 'src/components/Confirmation/Confirmation'
import { OrderManagementService } from 'src/services/Admin/OrderManagementService'
import { orderStatusEnum } from 'src/utils/EnumList'

const TABLE_HEAD = [
	{ head: 'OrderID', customeStyle: '!text-left w-[10%]', key: 'orderID' },
	{ head: 'AccountID', customeStyle: '!text-left w-[20%]', key: 'accountID' },
	{ head: 'OrderAddress', customeStyle: 'text-right w-[15%]', key: 'orderAddress' },
	{ head: 'TotalPrice', customeStyle: 'text-right w-[15%]', key: 'totalPrice' },
	{ head: 'OrderDate', customeStyle: 'text-right w-[15%]', key: 'orderDate' },
	{ head: 'OrderStatus', customeStyle: 'text-right w-[10%]', key: 'orderStatus' },
	{ head: 'Actions', customeStyle: 'text-right w-[20%]', key: 'actions' },
]

function OrderManagement() {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [sortColumn, setSortColumn] = useState(null)
	const [sortDirection, setSortDirection] = useState('asc')
	const [tableRows, setTableRows] = useState([])

	useEffect(() => {
		async function fetchOrders() {
			const data = await OrderManagementService.GET_DELIVERY_ORDER()
			if (data) {
				setTableRows(data)
			}
		}
		fetchOrders()
	}, [])

	const sanitizeNumeric = (value) => parseFloat(value.replace(/[^0-9.-]+/g, '') || 0)

	const sortedRows = [...tableRows].sort((a, b) => {
		if (!sortColumn) return 0

		let valueA = a[sortColumn]
		let valueB = b[sortColumn]

		if (sortColumn === 'totalPrice') {
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

	const handleUpdateStatus = async (orderId, orderStatus) => {
		await OrderManagementService.UPDATE_ORDER(orderId, orderStatus)
		const updatedData = await OrderManagementService.GET_DELIVERY_ORDER()
		setTableRows(updatedData)
	}

	return (
		<section className='m-10'>
			<Card className='h-full w-full'>
				<CardBody>
					<div className='rounded-none flex flex-wrap gap-4 justify-between mb-4'>
						<div>
							<Typography variant='h3' color='blue-gray'>
								Order Management
							</Typography>
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
									<tr>
										<td className='p-4'>{row.orderID}</td>
										<td className='p-4 break-words whitespace-normal'>{row.accountID}</td>
										<td className='p-4 text-right'>{row.orderAddress}</td>
										<td className='p-4 text-right'>{row.totalPrice}</td>
										<td className='p-4 text-right'>{row.orderDate.split('T')[0]}</td>
										<td className='p-4 text-right'>{row.orderStatus}</td>
										<td className='p-4 text-right'>
											<div className='flex justify-end gap-4'>
												<Confirmation
													title='Confirm deliveried order?'
													description='Are you sure you want to confirm this order as deliveried?'
													handleConfirm={() =>
														handleUpdateStatus(row.orderID, orderStatusEnum.DELIVERIED)
													}
												>
													{(handleOpen) => (
														<Button onClick={handleOpen} color='green'>
															Deliveried
														</Button>
													)}
												</Confirmation>
											</div>
										</td>
									</tr>
								)
							})}
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

export default OrderManagement
