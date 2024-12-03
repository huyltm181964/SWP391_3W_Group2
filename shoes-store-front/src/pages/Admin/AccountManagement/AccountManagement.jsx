import { Button, Card, CardBody, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import Confirmation from 'src/components/Confirmation/Confirmation'
import { AccountManagementService } from 'src/services/AccountManagementService'
import { GetImage } from 'src/utils/GetImage'
import StaffManagement from '../StaffManagement/StaffManagement'
import { StaffManagementService } from 'src/services/StaffManagementService'

const TABLE_HEAD = [
	{ head: 'Id', customeStyle: '!text-left w-[5%]', key: 'accountID' },
	{ head: 'Avatar', customeStyle: '!text-left w-[9%]', key: 'avatar' },
	{ head: 'AccountEmail', customeStyle: '!text-left w-[13%]', key: 'accountEmail' },
	{ head: 'AccountName', customeStyle: 'text-left w-[13%]', key: 'accountName' },
	{ head: 'Gender', customeStyle: 'text-center w-[8%]', key: 'gender' },
	{ head: 'Birthday', customeStyle: 'text-center w-[10%]', key: 'birthDay' },
	{ head: 'Phone', customeStyle: 'text-center w-[10%]', key: 'phone' },
	{ head: 'Address', customeStyle: 'text-left w-[13%]', key: 'address' },
	{ head: 'Status', customeStyle: '!text-left w-[9%]', key: 'status' },
	{ head: 'Actions', customeStyle: 'text-center w-[10%]', key: 'actions' },
]

function AccountManagement() {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [sortColumn, setSortColumn] = useState(null)
	const [sortDirection, setSortDirection] = useState('asc')
	const [tableRows, setTableRows] = useState([])

	useEffect(() => {
		async function fetchAccounts() {
			const data = await AccountManagementService.GET_ALL()
			if (data) {
				setTableRows(data)
				console.log(data)
			}
		}
		fetchAccounts()
	}, [])

	const sortedRows = [...tableRows].sort((a, b) => {
		if (!sortColumn) return 0

		let valueA = a[sortColumn]
		let valueB = b[sortColumn]

		valueA = String(valueA).toLowerCase()
		valueB = String(valueB).toLowerCase()

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

	const handleUpdateStatus = async (email) => {
		const data = await StaffManagementService.UPDATE_STAFF_STATUS(email)
		if (data) {
			const updatedData = await StaffManagementService.GET_ALL_STAFFS()
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
								Account Management
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
										<td className='p-4'>
											<img
												src={GetImage(row.avatar)}
												alt={row.avatar}
												className='w-10 h-10 rounded-full'
											/>
										</td>
										<td className='p-4 break-words whitespace-normal'>{row.accountEmail}</td>
										<td className='p-4 break-words whitespace-normal'>{row.accountName}</td>
										<td className='p-4 text-center'>{row.gender || 'N/A'}</td>
										<td className='p-4 text-center '>
											{row.birthDay ? row.birthDay.split('T')[0] : 'N/A'}
										</td>

										<td className='p-4 text-center'>{row.phone || 'N/A'}</td>
										<td className='p-4 break-words whitespace-normal'>
											{row.accountAddress || 'N/A'}
										</td>
										<td className='p-4'>{row.status}</td>
										<td className='p-4 text-center'>
											<div>
												<Confirmation
													title='Are you sure?'
													description={`Do you really want to ${
														row.status === 'Blocked' ? 'activate' : 'block'
													} this account?`}
													handleConfirm={() => handleUpdateStatus(row.accountEmail)}
												>
													{(handleOpen) => (
														<Button
															onClick={handleOpen}
															color={row.status === 'Blocked' ? 'green' : 'red'}
															className='my-1'
														>
															{row.status === 'Blocked' ? 'Activate' : 'Block'}
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

export default AccountManagement
