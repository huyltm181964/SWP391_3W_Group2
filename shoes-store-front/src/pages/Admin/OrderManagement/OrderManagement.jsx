import { Button, Card, CardBody, Typography } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { OrderManagementService } from 'src/services/Admin/OrderManagementService'
import { GetImage } from 'src/utils/GetImage'

const TABLE_HEAD = [
	{ head: 'OrderID', customeStyle: '!text-center w-[10%]', key: 'orderID' },
	{ head: 'AccountID', customeStyle: '!text-center w-[10%]', key: 'accountID' },
	{ head: 'Email', customeStyle: '!text-left w-[17%]', key: 'accountEmail' },
	{ head: 'Name', customeStyle: '!text-left w-[10%]', key: 'accountName' },
	{ head: 'OrderAddress', customeStyle: 'text-left w-[13%]', key: 'orderAddress' },
	{ head: 'OrderDate', customeStyle: 'text-left w-[10%]', key: 'orderDate' },
	{ head: 'OrderStatus', customeStyle: 'text-left w-[10%]', key: 'orderStatus' },
]

function OrderManagement() {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [sortColumn, setSortColumn] = useState(null)
	const [sortDirection, setSortDirection] = useState('asc')
	const [tableRows, setTableRows] = useState([])
	const [error, setError] = useState(null)
	const [openAccordion, setOpenAccordion] = useState(null)

	useEffect(() => {
		async function fetchOrders() {
			try {
				const data = await OrderManagementService.GET_DELIVERY_ORDER()
				if (data) {
					setTableRows(data)
				}
			} catch (err) {
				setError('Failed to fetch order data. Please try again later.')
			}
		}
		fetchOrders()
	}, [])

	const sanitizeNumeric = (value) => parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0

	const sortedRows = tableRows.slice().sort((a, b) => {
		if (!sortColumn) return 0

		let valueA = a[sortColumn] ?? ''
		let valueB = b[sortColumn] ?? ''

		if (['orderID', 'accountID', 'totalPrice'].includes(sortColumn)) {
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
					aria-label={`Go to page ${i + 1}`}
				>
					{i + 1}
				</Button>
			)
		}
		return pageNumbers
	}

	const handleRowsPerPageChange = (e) => {
		setRowsPerPage(Number(e.target.value))
		setPage(0) // Reset to the first page when changing rows per page
	}

	const toggleAccordion = (id) => {
		setOpenAccordion((prev) => (prev === id ? null : id))
	}

	return (
		<section className='m-10'>
			<Card className='h-full w-full shadow-lg rounded-lg'>
				<CardBody>
					<div className='flex flex-wrap justify-between mb-6'>
						<Typography variant='h3' color='blue-gray' className='font-bold'>
							Order Management
						</Typography>
					</div>

					{error && (
						<Typography variant='small' color='red' className='mb-4'>
							{error}
						</Typography>
					)}

					<div className='overflow-hidden rounded-lg shadow-md'>
						{tableRows.length === 0 ? (
							<div className='flex flex-col items-center justify-center py-10'>
								<Typography variant='h5' color='gray' className='text-center'>
									No orders available.
								</Typography>
								<Typography variant='small' color='gray' className='text-center mt-2'>
									There are no orders to display at this moment. Please check back later.
								</Typography>
							</div>
						) : (
							<table className='w-full table-auto border-collapse'>
								<thead>
									<tr>
										{TABLE_HEAD.map(({ head, customeStyle, key }) => (
											<th
												key={key}
												className={`border-b border-gray-300 px-4 py-2 text-lg font-bold ${customeStyle}`}
												onClick={() => handleSort(key)}
											>
												{head} {sortColumn === key ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{paginatedRows.map((row) => (
										<React.Fragment key={row.orderID}>
											<tr
												className='text-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 px-4 py-2'
												onClick={() => toggleAccordion(row.orderID)}
											>
												<td className='text-center px-4 py-2'>{row.orderID}</td>
												<td className='text-center px-4 py-2'>{row.accountID}</td>
												<td className='text-left break-words px-4 py-2'>
													{row.account?.accountEmail || 'N/A'}
												</td>
												<td className='text-left break-words px-4 py-2'>
													{row.account?.accountName || 'N/A'}
												</td>
												<td className='text-left break-words px-4 py-2'>
													{row.orderAddress || 'N/A'}
												</td>
												<td className='text-left px-4 py-2'>
													{row.orderDate?.split('T')[0] || 'N/A'}
												</td>
												<td className='text-left px-4 py-2'>{row.orderStatus || 'N/A'}</td>
											</tr>
											{openAccordion === row.orderID && (
												<tr
													className={`transition-all duration-300 ease-in-out ${
														openAccordion === row.orderID
															? 'max-h-[500px] opacity-100'
															: 'max-h-0 opacity-0'
													} overflow-hidden`}
												>
													<td colSpan={TABLE_HEAD.length} className='bg-gray-50 px-6 py-4'>
														{row?.orderDetails?.map((detail, index) => (
															<div key={index} className='flex flex-wrap items-start gap-6 py-2'>
																<img
																	src={GetImage(detail.variant?.variantImg)}
																	alt=''
																	className='object-cover w-24 h-24 rounded-md'
																/>
																<div className='flex-1'>
																	<Typography variant='h6' className='font-bold'>
																		{detail.variant?.product?.productName}
																	</Typography>
																	<Typography variant='small' color='gray'>
																		Category: {detail.variant?.product?.productCategory}
																	</Typography>
																	<Typography variant='small' color='gray'>
																		Size: {detail.variant?.variantSize} | Color:
																		{detail.variant?.variantColor}
																	</Typography>
																</div>
																<div className='text-right'>
																	<Typography variant='small'>
																		Quantity: {detail.quantity}
																	</Typography>
																	<Typography variant='small'>
																		Price: ${detail.quantity * detail.unitPrice}
																	</Typography>
																</div>
															</div>
														))}
														<div className='mt-4 border-t-2 border-black pt-2 text-right'>
															<Typography variant='h6' className='font-medium'>
																Total Price: ${row.totalPrice}
															</Typography>
														</div>
													</td>
												</tr>
											)}
										</React.Fragment>
									))}
								</tbody>
							</table>
						)}
					</div>

					<div className='flex justify-between items-center mt-6'>
						<Button
							onClick={() => handleChangePage(page - 1)}
							disabled={page === 0}
							size='sm'
							color={page === 0 ? 'gray' : 'blue'}
							aria-label='Previous Page'
						>
							&lt;
						</Button>
						<div className='flex items-center gap-2'>{renderPageNumbers()}</div>
						<Button
							onClick={() => handleChangePage(page + 1)}
							disabled={page >= totalPages - 1}
							size='sm'
							color={page >= totalPages - 1 ? 'gray' : 'blue'}
							aria-label='Next Page'
						>
							&gt;
						</Button>
					</div>

					<div className='mt-4'>
						<label className='text-sm'>
							Rows per page:
							<select
								value={rowsPerPage}
								onChange={handleRowsPerPageChange}
								className='ml-2 border rounded-md p-1 text-sm'
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
