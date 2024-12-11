import { enqueueSnackbar } from 'notistack'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrderService } from 'src/services/User/OrderService'

const OrderVerify = () => {
	const navigate = useNavigate()
	useEffect(() => {
		const verifyPayment = async () => {
			await OrderService.VERIFY_ORDER(orderInfo.split('#')[1])
		}

		const windowUrl = window.location.search
		const params = new URLSearchParams(windowUrl)

		const vnp_TransactionStatus = params.get('vnp_TransactionStatus')
		const orderInfo = params.get('vnp_OrderInfo')
		if (vnp_TransactionStatus == '00') {
			verifyPayment()
			enqueueSnackbar('Payment success', { variant: 'success' })
		} else {
			enqueueSnackbar('Payment failed', { variant: 'error' })
		}
		setTimeout(() => {
			navigate('/account/history-order')
		}, 2000)
	}, [])
	return <div></div>
}

export default OrderVerify
