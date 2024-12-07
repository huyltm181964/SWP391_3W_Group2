import { Button, Card, CardBody, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { ExportProductService } from 'src/services/Staff/ExportProductService'
import OrderDetail from './OrderDetail'

const TABLE_HEAD = [
	{ head: 'OrderID', customeStyle: '!text-left w-[10%]', key: 'orderID' },
	{ head: 'Email', customeStyle: '!text-center w-[20%]', key: 'account.accountEmail' },
	{ head: 'Phone', customeStyle: 'text-center w-[15%]', key: 'account.phone' },
	{ head: 'Address', customeStyle: 'text-center w-[35%]', key: 'orderAddress' },
	{ head: 'Actions', customeStyle: 'text-center w-[20%]', key: 'actions' },
]

function OrderList() {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [sortColumn, setSortColumn] = useState(null)
	const [sortDirection, setSortDirection] = useState('asc')
	const [tableRows, setTableRows] = useState([])
	const [selectedOrderId, setSelectedOrderId] = useState(null)
	const [openOrderDetailPage, setOpenOrderDetailPage] = useState(null)
	const [orderDetailData, setOrderDetailData] = useState([])

	useEffect(() => {
		async function fetchOrders() {
			const data = await ExportProductService.GET_ORDERED_ORDER()
			if (data) {
				setTableRows(data)
			}
		}
		fetchOrders()
	}, [openOrderDetailPage])

	const sanitizeNumeric = (value) => parseFloat(String(value).replace(/[^0-9.-]+/g, '') || 0)

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
	const handleOpenOrderDetail = async (order) => {
		console.log('Order: ', order)
		setSelectedOrderId(order.orderID)
		console.log('Detail', order.orderDetails)
		setOrderDetailData(order.orderDetails)
		setOpenOrderDetailPage(true)
	}

	return (
		<section className='m-10'>
			<Card className='h-full w-full'>
				<CardBody>
					<div className='rounded-none flex flex-wrap gap-4 justify-between mb-4'>
						<div>
							<Typography variant='h3' color='blue-gray'>
								Order List
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
										<td className='p-4 text-left break-words whitespace-normal'>
											{row.account.accountEmail}
										</td>
										<td className='p-4 text-left'>{row.account.phone}</td>
										<td className='p-4 text-left break-words whitespace-normal'>
											{row.orderAddress}
										</td>
										<td className='p-4 text-right'>
											<div className='flex justify-center gap-4'>
												<Button variant='contained' onClick={() => handleOpenOrderDetail(row)}>
													View Detail
												</Button>
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>

					{openOrderDetailPage && selectedOrderId && (
						<OrderDetail
							open={openOrderDetailPage}
							handleClose={() => setOpenOrderDetailPage(false)}
							existingOrderId={selectedOrderId}
							orderDetailData={orderDetailData}
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

export default OrderList
