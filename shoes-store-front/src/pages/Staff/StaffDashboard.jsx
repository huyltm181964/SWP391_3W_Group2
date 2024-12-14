import { ArrowLeftStartOnRectangleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import {
	AdjustmentsVerticalIcon,
	ArrowDownTrayIcon,
	ArrowUpTrayIcon,
	ChatBubbleLeftEllipsisIcon,
	ShoppingCartIcon,
} from '@heroicons/react/24/solid'
import { Avatar, Card, List, ListItem, ListItemPrefix, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import NotificationBadge from 'src/components/Notification/NotificationBadge'
import { AccountService } from 'src/services/User/AccountService'
import { AuthService } from 'src/services/User/AuthService'
import { GetImage, GetLogo } from 'src/utils/GetImage'
import OrderList from './ExportProduct/OrderList'
import ImportInvoiceList from './ImportProduct/ImportInvoiceList'
import ReportCommentManagement from './ReportCommentManagement/ReportCommentManagement'
import ContactManagement from './ContactManagement.jsx/ContactManagement'

const StaffDashboard = () => {
	const [selectedPage, setSelectedPage] = useState(<ImportInvoiceList />)
	const [selectedPageKey, setSelectedPageKey] = useState('ImportProduct')
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
					<Typography className='text-lg font-bold text-gray-300'>Staff Dashboard</Typography>
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
						selected={selectedPageKey === 'ImportProduct'}
						onClick={() => handleSelectPage(<ImportInvoiceList />, 'ImportProduct')}
					>
						<ListItemPrefix>
							<ArrowDownTrayIcon className='h-5 w-5' />
						</ListItemPrefix>
						Import Product
					</ListItem>

					<ListItem
						className={LIST_ITEM_STYLES}
						selected={selectedPageKey === 'ExportProduct'}
						onClick={() => handleSelectPage(<OrderList />, 'ExportProduct')}
					>
						<ListItemPrefix>
							<ArrowUpTrayIcon className='h-5 w-5' />
						</ListItemPrefix>
						Export Product
					</ListItem>

					<ListItem
						className={LIST_ITEM_STYLES}
						selected={selectedPageKey === 'Comment'}
						onClick={() => handleSelectPage(<ReportCommentManagement />, 'Comment')}
					>
						<ListItemPrefix>
							<ChatBubbleLeftEllipsisIcon className='h-5 w-5' />
						</ListItemPrefix>
						Comment Management
					</ListItem>
					<ListItem
						className={LIST_ITEM_STYLES}
						selected={selectedPageKey === 'Contact'}
						onClick={() => handleSelectPage(<ContactManagement />, 'Contact')}
					>
						<ListItemPrefix>
							<QuestionMarkCircleIcon className='h-5 w-5' />
						</ListItemPrefix>
						Contact Management
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
			<div className='w-4/5 p-6 h-full ml-auto'>
				<div className='w-fit ml-auto'>
					<NotificationBadge />
				</div>
				{selectedPage}
			</div>
		</div>
	)
}

export default StaffDashboard
