import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react'
import { Button, IconButton, Typography, Input } from '@material-tailwind/react'
import { PlusIcon as AddIcon, MinusIcon as RemoveIcon } from '@heroicons/react/24/outline'
import { useState, useRef } from 'react'

const Restock = ({ open, handleClose, currentQuantity, productName, onRestock }) => {
	const [quantity, setQuantity] = useState(0)
	const [error, setError] = useState('')
	const quantityFieldRef = useRef(null)

	const handleIncrease = () => {
		if (quantity < 1000) {
			setQuantity((prev) => prev + 1)
			setError('')
		} else {
			setError('Maximum quantity reached.')
		}
	}

	const handleDecrease = () => {
		if (quantity > 0) {
			setQuantity((prev) => prev - 1)
			setError('')
		} else {
			setError('Quantity cannot be less than 0.')
		}
	}

	const handleInputChange = (e) => {
		const value = e.target.value

		if (value === '') {
			setQuantity('')
			setError('')
			return
		}

		const numericValue = parseInt(value, 10)

		if (!isNaN(numericValue) && numericValue >= 0) {
			setQuantity(numericValue)
			setError('')
		} else {
			setError('Quantity must be a positive integer.')
		}
	}

	const handleConfirm = () => {
		if (quantity >= 0) {
			onRestock(quantity)
			handleClose()
		} else {
			setError('Quantity must be zero or a positive integer.')
		}
	}

	return (
		<Dialog open={open} handler={handleClose} size='xs'>
			<DialogHeader>Import Quantity</DialogHeader>
			<DialogBody>
				<div className='flex flex-col gap-4'>
					<Typography>Enter number of quantity to import: </Typography>
					<div className='flex items-center justify-center gap-1'>
						<IconButton variant='text' onClick={handleDecrease}>
							<RemoveIcon className='h-5 w-5' />
						</IconButton>
						<Input
							ref={quantityFieldRef}
							label='+'
							type='number'
							value={quantity}
							onChange={handleInputChange}
							min={0}
							className='text-center '
						/>
						<IconButton variant='text' onClick={handleIncrease}>
							<AddIcon className='h-5 w-5' />
						</IconButton>
					</div>
					{error && (
						<Typography variant='small' className='text-red-500 text-center'>
							{error}
						</Typography>
					)}
					<Typography variant='small' className='text-center'>
						Current Quantity: {currentQuantity}
					</Typography>
				</div>
			</DialogBody>
			<DialogFooter>
				<Button variant='outlined' color='gray' onClick={handleClose} className='mr-2'>
					Cancel
				</Button>
				<Button variant='filled' color='blue' onClick={handleConfirm}>
					Confirm
				</Button>
			</DialogFooter>
		</Dialog>
	)
}

export default Restock
