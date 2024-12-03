import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { StatisticService } from 'src/services/StatisticService'

const Statistics = () => {
	const [comments, setComments] = useState({ count: 0, percentage: 0, extra: 0 })
	const [users, setUsers] = useState({ count: 0, percentage: 0, extra: 0 })
	const [orders, setOrders] = useState({ count: 0, percentage: 0, extra: 0 })
	const [revenues, setRevenues] = useState({ count: 0, percentage: 0, extra: 0 })

	const [monthlyRevenue, setMonthlyRevenue] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const [comments, users, orders, revenues, monthlyRevenues] = await Promise.all([
				StatisticService.TOTAL_COMMENTS(),
				StatisticService.TOTAL_USERS(),
				StatisticService.TOTAL_ORDERS(),
				StatisticService.TOTAL_REVENUES(),
				StatisticService.MONTHLY_REVENUES(),
			])
			setComments(comments)
			setUsers(users)
			setOrders(orders)
			setRevenues(revenues)
			setMonthlyRevenue(monthlyRevenues)
		}

		fetchData()
	}, [])

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6 p-4'>
			{/* Dashboard Header */}
			<div className='col-span-4 mb-4'>
				<h1 className='text-2xl font-bold'>Dashboard</h1>
			</div>

			{/* Analytics Cards */}
			<AnalyticCard title='Total Comments Received' data={comments} />
			<AnalyticCard title='Total Users Enroll' data={users} />
			<AnalyticCard title='Total Orders' data={orders} />
			<AnalyticCard title='Total Revenues' data={revenues} isCurrency />

			{/* Line Chart */}
			<div className='col-span-4 lg:col-span-4 bg-white shadow rounded-lg p-4'>
				<h2 className='text-lg font-semibold mb-2'>Monthly Revenues</h2>
				<LineChart label='Monthly Revenues' data={monthlyRevenue} />
			</div>
		</div>
	)
}

// AnalyticCard Component
const AnalyticCard = ({ title, data, isCurrency = false }) => {
	const { count, percentage, extra } = data
	const isLoss = percentage < 0

	return (
		<div className='bg-white shadow rounded-lg p-4'>
			<h3 className='text-sm text-gray-600'>{title}</h3>
			<div className='flex items-center justify-between mt-2'>
				<p className='text-2xl font-bold'>{isCurrency ? `$${count}` : count}</p>
				<span
					className={`text-sm px-2 py-1 rounded-lg ${
						isLoss ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
					}`}
				>
					{isLoss ? '↓' : '↑'} {Math.abs(percentage)}%
				</span>
			</div>
			<p className={`text-xs mt-1 ${isLoss ? 'text-red-300' : 'text-green-700'}`}>
				{isLoss ? 'Loss' : 'Gain'} {isCurrency ? `$${Math.abs(extra)}` : Math.abs(extra)} this month
			</p>
		</div>
	)
}

// LineChart Component
const LineChart = ({ label, data = [] }) => {
	const options = {
		chart: {
			type: 'area',
			height: 350,
			toolbar: { show: false },
		},
		stroke: { curve: 'smooth' },
		xaxis: {
			categories: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			],
		},
		yaxis: { labels: { style: { colors: '#6B7280' }, formatter: (value) => `$${value}` } },
		grid: { borderColor: '#E5E7EB' },
	}

	const series = [
		{
			name: label,
			data: data,
		},
	]

	return <Chart options={options} series={series} type='area' height={350} />
}

export default Statistics
