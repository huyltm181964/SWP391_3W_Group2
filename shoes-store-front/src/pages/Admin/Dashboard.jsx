import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline'
import {
	AdjustmentsVerticalIcon,
	ChartBarIcon,
	ShoppingCartIcon,
	TicketIcon,
	UserCircleIcon,
} from '@heroicons/react/24/solid'
import { Avatar, Card, List, ListItem, ListItemPrefix, Typography } from '@material-tailwind/react'
import Statistics from './Statistics/Statistics'
import ProductManagement from './ProductManagement/ProductManagement'
import VariantManagement from './VariantManagement/VariantManagement'
import OrderManagement from './OrderManagement/OrderManagement'
import AccountManagement from './AccountManagement/AccountManagement'
import { useEffect, useState } from 'react'
import { AuthService } from 'src/services/AuthService'
import { AccountService } from 'src/services/AccountService'
import { GetImage, GetLogo } from 'src/utils/GetImage'

const Dashboard = () => {
	const [selectedPage, setSelectedPage] = useState(<Statistics />)
	const [selectedPageKey, setSelectedPageKey] = useState('Statistics')
	const [profile, setProfile] = useState({})

	const handleSelectPage = (page, pageKey) => {
		setSelectedPage(page)
		setSelectedPageKey(pageKey)
	}
	useEffect(() => {
		const fetchData = async () => {
			const data = await AccountService.GET_PROFILE()
			if (data) {
				setProfile(data)
			}
		}
		fetchData()
	}, [])

	const LIST_ITEM_STYLES =
		'text-gray-500 hover:text-white focus:text-white active:text-white hover:bg-opacity-20 focus:bg-opacity-20 active:bg-opacity-20'

	return (
		<div className='flex h-screen'>
			<Card color='gray' className='rounded-none h-full w-2/8 p-6 shadow-md fixed w-1/5'>
				<div className='mb-2 flex items-center gap-4 p-4'>
					<img src={GetLogo()} alt='logo' className='h-9 w-9' />
					<Typography className='text-lg font-bold text-gray-300'>Admin Dashboard</Typography>
				</div>
				<hr className='my-2 border-gray-800' />
				<List>
					<div className='mb-2 flex items-center gap-2 py-4'>
						<ListItemPrefix>
							<Avatar
								size='sm'
								className='aspect-square object-cover'
								src={GetImage(profile.avatar)}
							/>
						</ListItemPrefix>
						<Typography className='mr-auto font-normal text-white'>
							{profile.accountName}
						</Typography>
					</div>
					<hr className='my-2 border-gray-800' />
					<ListItem
						className={LIST_ITEM_STYLES}
						selected={selectedPageKey === 'Statistics'}
						onClick={() => handleSelectPage(<Statistics />, 'Statistics')}
					>
						<ListItemPrefix>
							<ChartBarIcon className='h-5 w-5' />
						</ListItemPrefix>
						Statistics
					</ListItem>

					<ListItem
						className={LIST_ITEM_STYLES}
						selected={selectedPageKey === 'Products'}
						onClick={() => handleSelectPage(<ProductManagement />, 'Products')}
					>
						<ListItemPrefix>
							<ShoppingCartIcon className='h-5 w-5' />
						</ListItemPrefix>
						Products
					</ListItem>

					<ListItem
						className={LIST_ITEM_STYLES}
						selected={selectedPageKey === 'Variants'}
						onClick={() => handleSelectPage(<VariantManagement />, 'Variants')}
					>
						<ListItemPrefix>
							<AdjustmentsVerticalIcon className='h-5 w-5' />
						</ListItemPrefix>
						Variants
					</ListItem>

					<ListItem
						className={LIST_ITEM_STYLES}
						selected={selectedPageKey === 'Orders'}
						onClick={() => handleSelectPage(<OrderManagement />, 'Orders')}
					>
						<ListItemPrefix>
							<TicketIcon className='h-5 w-5' />
						</ListItemPrefix>
						Orders
					</ListItem>

					<ListItem
						className={LIST_ITEM_STYLES}
						selected={selectedPageKey === 'Account'}
						onClick={() => handleSelectPage(<AccountManagement />, 'Account')}
					>
						<ListItemPrefix>
							<UserCircleIcon className='h-5 w-5' />
						</ListItemPrefix>
						Account
					</ListItem>
				</List>
				<hr className='my-2 border-gray-800' />
				<List>
					<ListItem onClick={() => AuthService.LOGOUT()} className={LIST_ITEM_STYLES}>
						<ListItemPrefix>
							<ArrowLeftStartOnRectangleIcon strokeWidth={2.5} className='h-5 w-5' />
						</ListItemPrefix>
						Sign Out
					</ListItem>
				</List>
			</Card>

			<div className='w-4/5 p-6 h-full ml-auto'>{selectedPage}</div>
		</div>
	)
}

export default Dashboard
