import { Checkbox, Input, Typography } from '@material-tailwind/react'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { AccountService } from 'src/services/User/AccountService'
import { CartService } from 'src/services/User/CartService'
import { OrderService } from 'src/services/User/OrderService'
import { GetImage } from 'src/utils/GetImage'

const Cart = () => {
	const [cartItems, setCartItems] = useState([])
	const [isEvent, setIsEvent] = useState(false)

	const [orderAddress, setOrderAddress] = useState('')
	const [selectedVariants, setSelectedVariants] = useState([])

	useEffect(() => {
		const fetchAddress = async () => {
			const data = await AccountService.GET_PROFILE()
			if (data) {
				setOrderAddress(data.accountAddress)
			}
		}
		fetchAddress()
	}, [])

	useEffect(() => {
		const fetch = async () => {
			const data = await CartService.GET_CART()
			setCartItems(data)
		}

		fetch()
	}, [isEvent])

	const handleToggle = (variantID) => {
		setSelectedVariants((prev) =>
			prev.includes(variantID) ? prev.filter((id) => id !== variantID) : [...prev, variantID]
		)
	}

	const handleRemoveItem = async (variantID) => {
		await CartService.DELETE_ITEM(variantID)
		setIsEvent(!isEvent)
	}

	const handleUpdateItem = async (variantID, quantity) => {
		const formData = new FormData()
		formData.append('userID', 0)
		formData.append('variantID', variantID)
		formData.append('quantity', quantity)
		await CartService.UPDATE_ITEM(formData)
		setIsEvent(!isEvent)
	}

	const calculateSummary = () => {
		const selectedItems = cartItems.filter((item) => selectedVariants.includes(item.variantID))
		const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
		const totalPrice = selectedItems.reduce((sum, item) => sum + item.totalItemPrice, 0)
		return { totalQuantity, totalPrice }
	}

	const { totalQuantity, totalPrice } = calculateSummary()

	const handleCheckout = async (e) => {
		e.preventDefault()
		if (selectedVariants?.length === 0) {
			enqueueSnackbar('Please select at least one product to checkout', { variant: 'error' })
			return
		}

		const formBody = {
			accountID: 0,
			orderAddress: orderAddress,
			variantID: selectedVariants,
		}
		const response = await OrderService.CHECK_OUT(formBody)
		if (response.success) {
			enqueueSnackbar(response.message, { variant: 'success' })
			setOrderAddress('')
			setSelectedVariants([])
			setIsEvent(!isEvent)

			if (response.data?.orderID) {
				setTimeout(async () => {
					const res = await OrderService.GET_PAYMENT_URL(response.data?.orderID)
					if (res?.success) {
						window.location.href = res.data
					}
				}, 2000)
			}
		}
	}

	return (
		<section className='p-4'>
			<h2 className='text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl'>
				Shopping Cart
			</h2>

			<div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
				<div className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'>
					<div className='space-y-6'>
						{cartItems?.length !== 0 ? (
							cartItems.map((cartItem) => (
								<div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6'>
									<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
										<Checkbox
											id={`checkbox-${cartItem.variantID}`}
											checked={selectedVariants.includes(cartItem.variantID)}
											onChange={() => handleToggle(cartItem.variantID)}
											label=''
											className='w-6 h-6 md:order-1'
										/>
										<div className='w-1/6'>
											<img alt='' className='w-full' src={GetImage(cartItem.variant?.variantImg)} />
										</div>

										<div className='flex items-center justify-between w-2/6 md:order-3 md:justify-end gap-3'>
											<div className='flex items-center justify-between w-1/2'>
												<button
													type='button'
													id='decrement-button'
													onClick={() =>
														handleUpdateItem(cartItem.variantID, cartItem.quantity - 1)
													}
													data-input-counter-decrement='counter-input'
													className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700'
												>
													<svg
														className='h-2.5 w-2.5 text-gray-900 dark:text-white'
														aria-hidden='true'
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 18 2'
													>
														<path
															stroke='currentColor'
															stroke-linecap='round'
															stroke-linejoin='round'
															stroke-width='2'
															d='M1 1h16'
														/>
													</svg>
												</button>
												<input
													type='text'
													id='counter-input'
													data-input-counter
													className='w-20 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white'
													placeholder=''
													value={cartItem.quantity}
													required
												/>
												<button
													type='button'
													id='increment-button'
													onClick={() =>
														handleUpdateItem(cartItem.variantID, cartItem.quantity + 1)
													}
													data-input-counter-increment='counter-input'
													className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700'
												>
													<svg
														className='h-2.5 w-2.5 text-gray-900 dark:text-white'
														aria-hidden='true'
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 18 18'
													>
														<path
															stroke='currentColor'
															stroke-linecap='round'
															stroke-linejoin='round'
															stroke-width='2'
															d='M9 1v16M1 9h16'
														/>
													</svg>
												</button>
											</div>
											<div className='text-end md:order-4 md:w-1/2'>
												<p className='text-base font-bold text-gray-900 dark:text-white'>
													${cartItem.totalItemPrice}
												</p>
											</div>
										</div>

										<div className='w-3/6 min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
											<p className='text-base font-medium text-gray-900 '>
												{cartItem.variant?.product?.productName}{' '}
												{`(Size: ${cartItem.variant?.variantSize} | Color: ${cartItem.variant?.variantColor})`}
											</p>

											<div className='flex items-center gap-4'>
												<button
													type='button'
													onClick={() => handleRemoveItem(cartItem.variantID)}
													className='inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500'
												>
													<svg
														className='me-1.5 h-5 w-5'
														aria-hidden='true'
														xmlns='http://www.w3.org/2000/svg'
														width='24'
														height='24'
														fill='none'
														viewBox='0 0 24 24'
													>
														<path
															stroke='currentColor'
															stroke-linecap='round'
															stroke-linejoin='round'
															stroke-width='2'
															d='M6 18 17.94 6M18 18 6.06 6'
														/>
													</svg>
													Remove
												</button>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<Typography className='ml-5' variant='h4'>
								No item in cart
							</Typography>
						)}
					</div>
				</div>

				<div className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'>
					<form
						onSubmit={handleCheckout}
						className='space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6'
					>
						<p className='text-xl font-semibold text-gray-900 dark:text-white'>Order summary</p>

						<div className='space-y-4'>
							<Input
								label='Address'
								value={orderAddress}
								required
								onChange={(e) => setOrderAddress(e.target.value)}
							/>
							<dl className='flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700'>
								<dt className='text-base font-bold text-gray-900 dark:text-white'>Quantity</dt>
								<dd className='text-base font-bold text-gray-900 dark:text-white'>
									{totalQuantity}
								</dd>
							</dl>
							<dl className='flex items-center justify-between gap-4'>
								<dt className='text-base font-bold text-gray-900 dark:text-white'>Total</dt>
								<dd className='text-base font-bold text-gray-900 dark:text-white'>${totalPrice}</dd>
							</dl>
						</div>

						<button
							type='submit'
							className='flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
						>
							Proceed to Checkout
						</button>

						<div className='flex items-center justify-center gap-2'>
							<span className='text-sm font-normal text-gray-500 dark:text-gray-400'> or </span>
							<a
								href='/product'
								title=''
								className='inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500'
							>
								Continue Shopping
								<svg
									className='h-5 w-5'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<path
										stroke='currentColor'
										stroke-linecap='round'
										stroke-linejoin='round'
										stroke-width='2'
										d='M19 12H5m14 0-4 4m4-4-4-4'
									/>
								</svg>
							</a>
						</div>
					</form>
				</div>
			</div>
		</section>
	)
}

export default Cart
