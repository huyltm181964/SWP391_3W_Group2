import { Accordion, AccordionBody, AccordionHeader } from '@material-tailwind/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDateWithLetterMonth, getDateFromDateTime } from 'src/utils/DateUtil'
import { GetImage } from 'src/utils/GetImage'

const OrderCard = ({ open, setOpen, order, handleCancel }) => {
	const navigate = useNavigate()
	return (
		<Accordion open={open} className='bg-white'>
			<AccordionHeader className='pointer-events-none'>
				<div class='flex max-md:flex-col items-center justify-between px-3 w-full md:px-11'>
					<div class='data flex-grow'>
						<p class='font-medium text-lg leading-8 text-black whitespace-nowrap'>
							Order : #{order?.orderID}
						</p>
						<p class='font-medium text-lg leading-8 text-black mt-3 whitespace-nowrap'>
							Order Payment : {formatDateWithLetterMonth(getDateFromDateTime(order?.orderDate))}
						</p>
						<p class='font-medium text-lg leading-8 text-black mt-3 whitespace-nowrap'>
							Order Status :{' '}
							<span
								style={{
									color: order?.orderStatus?.toLowerCase() === 'completed' ? 'green' : 'royalblue',
									fontWeight: 'bold',
								}}
							>
								{order?.orderStatus}
							</span>
						</p>
					</div>
					<div class='flex items-center gap-3 max-md:mt-5'>
						{order?.orderStatus.toLowerCase() === 'ordered' && (
							<button
								onClick={() => navigate('/account/payment/' + order?.orderID)}
								type='button'
								class='pointer-events-auto cursor-pointer text-black px-7 py-3 shadow-sm shadow-transparent font-semibold transition-all duration-500 hover:underline'
							>
								Get Payment URL
							</button>
						)}
						{order?.orderStatus.toLowerCase() === 'ordered' && (
							<button
								onClick={() => handleCancel(order?.orderID)}
								type='button'
								class='rounded-full pointer-events-auto cursor-pointer px-7 py-3 bg-red-700 shadow-sm shadow-transparent text-white font-semibold text-sm transition-all duration-500 hover:shadow-red-400 hover:bg-red-900'
							>
								Cancel order
							</button>
						)}
						<button
							onClick={() => setOpen(order?.orderID)}
							type='button'
							class='rounded-full pointer-events-auto cursor-pointer px-7 py-3 bg-indigo-600 shadow-sm shadow-transparent text-white font-semibold text-sm transition-all duration-500 hover:shadow-indigo-400 hover:bg-indigo-700'
						>
							Show Invoice
						</button>
					</div>
				</div>
			</AccordionHeader>
			<AccordionBody>
				<div className='divide-y-2 divide-gray-300'>
					{order?.orderDetails?.map((detail) => (
						<div class='py-2 flex max-lg:flex-col items-center gap-8 lg:gap-24 px-3 md:px-11'>
							<div class='grid grid-cols-4 w-full'>
								<div class='col-span-4 sm:col-span-1'>
									<img
										src={GetImage(detail.variant?.variantImg)}
										alt=''
										class='max-sm:mx-auto object-cover'
									/>
								</div>
								<div class='col-span-4 sm:col-span-3 max-sm:mt-4 sm:pl-8 flex flex-col justify-center max-sm:items-center'>
									<h6 class='font-manrope font-semibold text-2xl leading-9 text-black mb-3 whitespace-nowrap'>
										{detail.variant?.product?.productName}
									</h6>
									<p class='font-normal text-lg leading-8 text-gray-500 mb-8 whitespace-nowrap'>
										Category: {detail.variant?.product?.productCategory}
									</p>
									<div class='flex items-center max-sm:flex-col gap-x-10 gap-y-3'>
										<span class='font-normal text-lg leading-8 text-gray-500 whitespace-nowrap'>
											Size: {detail.variant?.variantSize}
										</span>
										<span class='font-normal text-lg leading-8 text-gray-500 whitespace-nowrap'>
											Color: {detail.variant?.variantColor}
										</span>
									</div>
								</div>
							</div>
							<div class='flex items-center justify-around w-full  sm:pl-28 lg:pl-0'>
								<div class='flex flex-col justify-center items-start max-sm:items-center'>
									<p class='font-semibold text-xl leading-8 text-black whitespace-nowrap'>
										Qty: {detail.quantity}
									</p>
								</div>
								<div class='flex flex-col justify-center items-start max-sm:items-center'>
									<p class='font-semibold text-xl leading-8 text-black whitespace-nowrap'>
										Price: ${detail.quantity * detail.unitPrice}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div class='border-t-2 border-black px-3 md:px-11 flex items-center justify-between max-sm:flex-col-reverse'>
					<p class='ml-auto font-medium text-xl leading-8 text-black mt-2'>
						<span class='text-gray-500'>Total Price: </span> &nbsp;${order?.totalPrice}
					</p>
				</div>
			</AccordionBody>
		</Accordion>
	)
}

export default OrderCard
