import { Button, Input, Radio, Rating, Typography } from '@material-tailwind/react'
import { enqueueSnackbar } from 'notistack'
import { useEffect } from 'react'
import { useState } from 'react'
import { CartService } from 'src/services/CartService'
import { GetImage } from 'src/utils/GetImage'

const ProductDetailInformation = ({ product }) => {
	const [selectedSize, setSelectedSize] = useState(null)
	const [selectedColor, setSelectedColor] = useState(null)
	const [sizes, setSizes] = useState([])
	const [colors, setColors] = useState([])
	const [quantity, setQuantity] = useState(1)
	const [selectedVariant, setSelectedVariant] = useState(null)

	useEffect(() => {
		if (product?.productVariants?.length) {
			const uniqueSizes = [
				...new Set(product.productVariants.map((variant) => variant.variantSize)),
			]
			setSizes(uniqueSizes)
		}
	}, [product])

	useEffect(() => {
		if (selectedSize) {
			const availableColors = product?.productVariants
				.filter((variant) => variant.variantSize === selectedSize)
				.map((variant) => variant.variantColor)
			setColors(availableColors)
			setSelectedColor(null)
			setSelectedVariant(null)
		} else {
			setColors([])
		}
	}, [selectedSize, product])

	useEffect(() => {
		if (selectedSize && selectedColor) {
			const variant = product?.productVariants?.find(
				(variant) => variant.variantSize === selectedSize && variant.variantColor === selectedColor
			)
			setSelectedVariant(variant || null)
		}
	}, [selectedSize, selectedColor, product])

	const handleAddToCart = async (e) => {
		e.preventDefault()

		if (!!!localStorage.getItem('token')) {
			enqueueSnackbar('You need to login before add to cart', { variant: 'error' })
			return
		}

		const formData = new FormData()
		formData.append('variantID', selectedVariant.variantID)
		formData.append('quantity', quantity)

		const data = await CartService.ADD_CART(formData)
		if (data.success) {
			enqueueSnackbar('Add to cart successfully', { variant: 'success' })
		}
	}

	return (
		<div className='grid place-items-center grid-cols-1 md:grid-cols-2 gap-5'>
			<img
				src={
					selectedVariant ? GetImage(selectedVariant?.variantImg) : GetImage(product?.productImg)
				}
				alt='pink blazer'
				className='min-h-[36rem] object-cover'
			/>
			<div className='w-full'>
				<Typography className='mb-4' variant='h3'>
					{product?.productName}
				</Typography>
				<Typography variant='h5'>${product?.productPrice}</Typography>
				<Typography className='!mt-4 text-base font-normal leading-[27px] !text-gray-500'>
					{product?.productDescription}
				</Typography>
				<Typography color='blue-gray' variant='h6'>
					Size
				</Typography>
				<div className='my-8 mt-3 flex items-center gap-2'>
					{sizes.map((size) => (
						<Radio
							key={`size-${size}`}
							id={`size-${size}`}
							name='size'
							label={size.toUpperCase()}
							onChange={() => setSelectedSize(size)}
						/>
					))}
				</div>
				<Typography color='blue-gray' variant='h6'>
					Color
				</Typography>
				<div className='my-8 mt-3 flex items-center gap-2'>
					{colors.length === 0 ? (
						<Typography variant='small'>Choose a size to view color</Typography>
					) : (
						colors.map((color) => (
							<Radio
								key={`color-${color}`}
								color={color.toLowerCase()}
								id={`color-${color}`}
								name='color'
								label={color.toUpperCase()}
								onChange={() => setSelectedColor(color)}
							/>
						))
					)}
				</div>
				{selectedVariant?.variantQuantity === 0 && (
					<Typography color='red'>This variant is out of stock</Typography>
				)}
				<form onSubmit={handleAddToCart} className='mb-4 flex w-full items-center gap-3'>
					<Input
						type='number'
						label='Quantity'
						value={quantity}
						disabled={!selectedVariant || selectedVariant?.variantQuantity === 0}
						onChange={(e) => setQuantity(e.target.value)}
						min={1}
						max={selectedVariant?.variantQuantity}
					/>
					<Button
						color='gray'
						className='w-full'
						disabled={!selectedVariant || selectedVariant?.variantQuantity === 0}
						type='submit'
					>
						{selectedVariant ? 'Add to Cart' : 'Select Options'}
					</Button>
				</form>
			</div>
		</div>
	)
}

export default ProductDetailInformation
