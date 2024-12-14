import { Accordion, AccordionBody, AccordionHeader } from '@material-tailwind/react'
import { useNavigate } from 'react-router-dom'
import { OrderService } from 'src/services/User/OrderService'
import { formatDateWithLetterMonth, getDateFromDateTime } from 'src/utils/DateUtil'
import { orderStatusEnum } from 'src/utils/EnumList'
import { GetImage } from 'src/utils/GetImage'

const OrderCard = ({ open, setOpen, order, handleCancel, handleConfirm }) => {
	const navigate = useNavigate()

	const statusColors = {
		unpaid: 'red',
		ordered: 'royalblue',
		delivery: 'orange',
		deliveried: 'purple',
		completed: 'green',
	}

	const getPaymentUrl = async (orderID) => {
		const res = await OrderService.GET_PAYMENT_URL(orderID)
		if (res?.success) {
			window.location.href = res.data
		} else {
			navigate('/404')
		}
	}

	return (
		<Accordion open={open} className='bg-white'>
			<AccordionHeader className='pointer-events-none'>
				<div className='flex max-md:flex-col items-center justify-between px-3 w-full md:px-11'>
					<div className='data flex-grow'>
						<p className='font-medium text-lg leading-8 text-black whitespace-nowrap'>
							Order : #{order?.orderID}
						</p>
						<p className='font-medium text-lg leading-8 text-black mt-3 whitespace-nowrap'>
							Order Payment : {formatDateWithLetterMonth(getDateFromDateTime(order?.orderDate))}
						</p>
						<p className='font-medium text-lg leading-8 text-black mt-3 whitespace-nowrap'>
							Order Status :{' '}
							<span
								style={{
									color: statusColors[order?.orderStatus?.toLowerCase()] || 'royalblue',
									fontWeight: 'bold',
								}}
							>
								{order?.orderStatus}
							</span>
						</p>
					</div>
					<div className='flex items-center gap-3 max-md:mt-5'>
						{order?.orderStatus === orderStatusEnum.UNPAID && (
							<button
								onClick={() => getPaymentUrl(order?.orderID)}
								type='button'
								className='pointer-events-auto cursor-pointer text-black px-7 py-3 shadow-sm shadow-transparent font-semibold transition-all duration-500 hover:underline'
							>
								Get Payment
							</button>
						)}
						{order?.orderStatus === orderStatusEnum.UNPAID && (
							<button
								onClick={() => handleCancel(order?.orderID)}
								type='button'
								className='rounded-full pointer-events-auto cursor-pointer px-7 py-3 bg-red-700 shadow-sm shadow-transparent text-white font-semibold text-sm transition-all duration-500 hover:shadow-red-400 hover:bg-red-900'
							>
								Cancel order
							</button>
						)}
						{order?.orderStatus === orderStatusEnum.DELIVERIED && (
							<button
								onClick={() => handleConfirm(order?.orderID)}
								type='button'
								className='rounded-full pointer-events-auto cursor-pointer px-7 py-3 bg-green-800 shadow-sm shadow-transparent text-white font-semibold text-sm transition-all duration-500 hover:shadow-green-400 hover:bg-green-900'
							>
								Confirm ordered
							</button>
						)}
						<button
							onClick={() => setOpen(order?.orderID)}
							type='button'
							className='rounded-full pointer-events-auto cursor-pointer px-7 py-3 bg-indigo-600 shadow-sm shadow-transparent text-white font-semibold text-sm transition-all duration-500 hover:shadow-indigo-400 hover:bg-indigo-700'
						>
							Show Invoice
						</button>
					</div>
				</div>
			</AccordionHeader>
			<AccordionBody>
				<div className='divide-y-2 divide-gray-300'>
					{order?.orderDetails?.map((detail) => (
						<div className='py-2 flex max-lg:flex-col items-center gap-8 lg:gap-24 px-3 md:px-11'>
							<div className='grid grid-cols-4 w-full'>
								<div className='col-span-4 sm:col-span-1'>
									<img
										src={GetImage(detail.variant?.product.productImg)}
										alt=''
										className='max-sm:mx-auto object-cover'
									/>
								</div>
								<div className='col-span-4 sm:col-span-3 max-sm:mt-4 sm:pl-8 flex flex-col justify-center max-sm:items-center'>
									<h6 className='font-manrope font-semibold text-2xl leading-9 text-black mb-3 whitespace-nowrap'>
										{detail.variant?.product?.productName}
									</h6>
									<p className='font-normal text-lg leading-8 text-gray-500 mb-8 whitespace-nowrap'>
										Category: {detail.variant?.product?.productCategory}
									</p>
									<div className='flex items-center max-sm:flex-col gap-x-10 gap-y-3'>
										<span className='font-normal text-lg leading-8 text-gray-500 whitespace-nowrap'>
											Size: {detail.variant?.variantSize}
										</span>
										<span className='font-normal text-lg leading-8 text-gray-500 whitespace-nowrap'>
											Color: {detail.variant?.variantColor}
										</span>
									</div>
								</div>
							</div>
							<div className='flex items-center justify-around w-full  sm:pl-28 lg:pl-0'>
								<div className='flex flex-col justify-center items-start max-sm:items-center'>
									<p className='font-semibold text-xl leading-8 text-black whitespace-nowrap'>
										Qty: {detail.quantity}
									</p>
								</div>
								<div className='flex flex-col justify-center items-start max-sm:items-center'>
									<p className='font-semibold text-xl leading-8 text-black whitespace-nowrap'>
										Price: ${detail.quantity * detail.unitPrice}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className='border-t-2 border-black px-3 md:px-11 flex items-center justify-between max-sm:flex-col-reverse'>
					<p className='ml-auto font-medium text-xl leading-8 text-black mt-2'>
						<span className='text-gray-500'>Total Price: </span> &nbsp;${order?.totalPrice}
					</p>
				</div>
			</AccordionBody>
		</Accordion>
	)
}

export default OrderCard
