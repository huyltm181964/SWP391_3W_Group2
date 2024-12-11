import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OrderService } from 'src/services/User/OrderService'

const Payment = () => {
	const { id } = useParams()

	const navigate = useNavigate()
	useEffect(() => {
		const fetch = async () => {
			const res = await OrderService.GET_PAYMENT_URL(id)
			if (res?.success) {
				window.location.href = res.data
			} else {
				navigate('/404')
			}
		}
		fetch()
	}, [])
	return (
		<Card className='w-1/2 mx-auto my-12'>
			<CardHeader className='flex flex-col items-center'>
				<CheckCircleIcon color='green' height={'5rem'} />
				<Typography variant='h4'>Thanks for placing your order</Typography>
			</CardHeader>
		</Card>
	)
}

export default Payment
