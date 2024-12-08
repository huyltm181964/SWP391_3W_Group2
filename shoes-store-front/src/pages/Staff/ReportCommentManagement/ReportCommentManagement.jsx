import { Button, Card, CardBody, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import Confirmation from 'src/components/Confirmation/Confirmation'
import { CommentManagementService } from 'src/services/Staff/CommentManagementService'

const TABLE_HEAD = [
	{ head: 'AccountID', customeStyle: '!text-left w-[10%]', key: 'accountID' },
	{ head: 'ProductID', customeStyle: '!text-left w-[10%]', key: 'productID' },
	{ head: 'Email', customeStyle: '!text-center w-[15%]', key: 'accountEmail' },
	{ head: 'Rate', customeStyle: 'text-center w-[15%]', key: 'rate' },
	{ head: 'Content', customeStyle: 'text-center w-[25%]', key: 'content' },
	{ head: 'Date', customeStyle: 'text-center w-[10%]', key: 'createdDate' },
	{ head: 'Actions', customeStyle: 'text-center w-[25%]', key: 'actions' },
]

function ReportCommentManagement() {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [sortColumn, setSortColumn] = useState(null)
	const [sortDirection, setSortDirection] = useState('asc')
	const [tableRows, setTableRows] = useState([])
	const [selectedOrderId, setSelectedOrderId] = useState(null)

	useEffect(() => {
		async function fetchComments() {
			const data = await CommentManagementService.GET_ALL()
			if (data) {
				setTableRows(data)
			}
		}
		fetchComments()
	}, [])

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
	const handleBanComment = async (productId, accountId, reasonValue) => {
		const formBody = {
			commentIdDTO: {
				productID: productId,
				accountID: accountId,
			},
			reason: reasonValue,
		}
		await CommentManagementService.BAN_COMMENT(formBody)

		const updatedData = await CommentManagementService.GET_ALL()
		if (updatedData) {
			setTableRows(updatedData)
		}
	}
	const handleUnreportComment = async (productId, accountId) => {
		const formBody = {
			productID: productId,
			accountID: accountId,
		}
		await CommentManagementService.UNREPORT_COMMENT(formBody)

		const updatedData = await CommentManagementService.GET_ALL()
		if (updatedData) {
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
								Report Comment Management
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
										<td className='p-4'>{row.accountID}</td>
										<td className='p-4'>{row.productID}</td>
										<td className='p-4 text-left break-words whitespace-normal'>
											{row.account.accountEmail}
										</td>
										<td className='p-4 text-center'>{row.rate}</td>
										<td className='p-4 text-left break-words whitespace-normal'>{row.content}</td>
										<td className='p-4 text-left '>
											{row.createdDate ? row.createdDate.split('T')[0] : 'N/A'}
										</td>
										<td className='p-4 text-right'>
											<div className='flex justify-center gap-4'>
												<Confirmation
													title='Are you sure?'
													description={`Do you really want to ban this account?`}
													reason={true}
													handleConfirm={(reasonValue) =>
														handleBanComment(row.accountID, row.productID, reasonValue)
													}
												>
													{(handleOpen) => (
														<Button onClick={handleOpen} color={'red'} className='my-1'>
															Ban
														</Button>
													)}
												</Confirmation>

												<Confirmation
													title='Are you sure?'
													description={`Do you really want to unreport this comment?`}
													handleConfirm={() => handleUnreportComment(row.accountID, row.productID)}
												>
													{(handleOpen) => (
														<Button onClick={handleOpen} color={'green'} className='my-1'>
															Unreport
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

export default ReportCommentManagement
