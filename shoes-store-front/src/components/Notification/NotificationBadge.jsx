import { MinusCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import {
	BellAlertIcon,
	ChatBubbleBottomCenterIcon,
	CubeIcon,
	HomeIcon,
} from '@heroicons/react/24/solid'
import { Badge, Card, IconButton, List, ListItem, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { NotificationService } from 'src/services/NotificationService'
import Confirmation from '../Confirmation/Confirmation'
import NotificationDialog from './NotificationDialog'

const NotificationBadge = () => {
	const [open, setOpen] = useState(false)
	const [notifications, setNotifications] = useState([])
	const [selectedId, setSelectedId] = useState(null)
	const [openDetail, setOpenDetail] = useState(false)
	const [isEvent, setIsEvent] = useState(false)

	useEffect(() => {
		const fetch = async () => {
			const data = await NotificationService.GET_ALL()
			if (data) {
				setNotifications(data)
			}
		}
		fetch()
	}, [openDetail, isEvent])

	const handleOpenDetail = (id) => {
		setSelectedId(id)
		setOpenDetail(true)
	}

	const handleClear = async () => {
		const response = await NotificationService.CLEAR()
		if (response.success) {
			setIsEvent(!isEvent)
		}
	}

	return (
		<>
			{openDetail && (
				<NotificationDialog handleClose={() => setOpenDetail(false)} notificationID={selectedId} />
			)}
			<div
				className='relative'
				onMouseOver={() => setOpen(true)}
				onMouseLeave={() => setOpen(false)}
			>
				<div className='flex items-center'>
					<Badge
						content={notifications?.filter((notification) => !notification?.isRead).length}
						withBorder
						color={
							notifications?.filter((notification) => !notification?.isRead).length
								? 'deep-orange'
								: 'blue'
						}
					>
						<IconButton size='lg' variant='text'>
							<BellAlertIcon className='h-6 w-6' />
						</IconButton>
					</Badge>
				</div>
				<Card
					className={`max-h-[300px] overflow-auto absolute z-50 right-0 w-96 shadow-gray-300 ${
						!open && 'hidden'
					}`}
				>
					<div className='flex justify-center items-center m-2 mb-0'>
						<Typography variant='h6' className='font-bold flex-grow'>
							Notifications
						</Typography>
						<Confirmation
							handleConfirm={handleClear}
							title={'Confirm clear'}
							description={'Are you sure you want to clear all read notification?'}
						>
							{(handleOpen) => (
								<IconButton onClick={handleOpen} variant='text'>
									<MinusCircleIcon className='w-full h-full' />
								</IconButton>
							)}
						</Confirmation>
					</div>
					<List>
						{notifications.length ? (
							notifications?.map((notification) => (
								<ListItem
									onClick={() => handleOpenDetail(notification.notificationID)}
									key={notification?.notificationID}
									className='flex gap-5 overflow-hidden h-max'
								>
									<Badge invisible={notification?.isRead}>
										<IconButton className='w-8 h-8 rounded-full' ripple={false}>
											{notification?.title?.toLowerCase().includes('order') ? (
												<CubeIcon className='w-full h-full' />
											) : notification?.title?.toLowerCase().includes('comment') ? (
												<ChatBubbleBottomCenterIcon className='w-full h-full' />
											) : notification?.title?.toLowerCase().includes('contact') ? (
												<QuestionMarkCircleIcon className='w-full h-full' />
											) : (
												<HomeIcon className='w-full h-full' />
											)}
										</IconButton>
									</Badge>
									<div>
										<Typography variant='h6' color='blue-gray'>
											{notification?.title}
										</Typography>
										<Typography
											variant='small'
											color='gray'
											className='font-normal whitespace-nowrap'
										>
											{notification?.description}
										</Typography>
									</div>
								</ListItem>
							))
						) : (
							<Typography className='ml-2'>No notifications</Typography>
						)}
					</List>
				</Card>
			</div>
		</>
	)
}

export default NotificationBadge
