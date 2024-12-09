import { XMarkIcon } from '@heroicons/react/24/solid'
import { Dialog, DialogBody, DialogHeader, IconButton, Typography } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { NotificationService } from 'src/services/NotificationService'

const NotificationDialog = ({ notificationID, handleClose }) => {
	const [notification, setNotification] = useState(null)
	useEffect(() => {
		const fetch = async () => {
			const response = await NotificationService.GET_NOTIFICATION_DETAIL(notificationID)
			if (response.success) {
				setNotification(response.data)
			} else {
				handleClose()
			}
		}

		fetch()
	}, [notificationID])
	return (
		<Dialog open={!!notification} handler={handleClose} size='lg'>
			<DialogHeader className='flex items-center justify-center'>
				<Typography variant='h6' className='flex-grow'>
					Notification: #{notificationID}
				</Typography>
				<IconButton variant='text' onClick={handleClose}>
					<XMarkIcon className='w-full h-full' />
				</IconButton>
			</DialogHeader>
			<DialogBody>
				<Typography variant='h6' className='font-bold'>
					{notification?.title}
				</Typography>
				<Typography variant='paragraph' className='whitespace-pre-wrap max-h-[50vh] overflow-auto'>
					{notification?.description}
				</Typography>
			</DialogBody>
		</Dialog>
	)
}

export default NotificationDialog
