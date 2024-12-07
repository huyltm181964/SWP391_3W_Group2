import { Typography } from '@material-tailwind/react'
import { enqueueSnackbar } from 'notistack'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import OrderCard from 'src/components/HistoryOrder/OrderCard'
import { OrderService } from 'src/services/User/OrderService'

const HistoryOrder = () => {
	const [historyOrder, setHistoryOrder] = useState([])
	const [open, setOpen] = useState(0)
	const [isEvent, setIsEvent] = useState(false)

	useEffect(() => {
		const fetch = async () => {
			const data = await OrderService.GET_HISTORY_ORDER()
			if (data) setHistoryOrder(data)
		}
		fetch()
	}, [isEvent])

	const handleCancel = async (orderID) => {
		const res = await OrderService.CANCEL_ORDER(orderID)
		if (res?.success) {
			enqueueSnackbar(res.message, { variant: 'success' })
			setIsEvent(!isEvent)
		}
	}

	const handleConfirmOrder = async (orderID) => {
		const res = await OrderService.CONFIRM_ORDER(orderID)
		if (res?.success) {
			enqueueSnackbar('Thanks for confirming', { variant: 'success' })
			setIsEvent(!isEvent)
		}
	}

	const handleOpen = (value) => setOpen(open === value ? 0 : value)

	return (
		<div className='p-4 flex flex-col gap-2'>
			{historyOrder.length !== 0 ? (
				historyOrder.map((order) => (
					<OrderCard
						open={open === order?.orderID}
						handleCancel={handleCancel}
						handleConfirm={handleConfirmOrder}
						setOpen={handleOpen}
						order={order}
					/>
				))
			) : (
				<Typography variant='h4'>No order has been placed</Typography>
			)}
		</div>
	)
}

export default HistoryOrder
