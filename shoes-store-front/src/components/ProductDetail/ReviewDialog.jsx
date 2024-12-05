import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	IconButton,
	Input,
	Rating,
	Textarea,
	Typography,
} from '@material-tailwind/react'
import { enqueueSnackbar } from 'notistack'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CommentService } from 'src/services/CommentService'

const ReviewDialog = ({ open, handleClose, product }) => {
	const isLoggedIn = !!localStorage.getItem('token')

	const [comment, setComment] = useState({})
	const [rate, setRate] = useState(undefined)
	const [content, setContent] = useState('')

	useEffect(() => {
		const fetch = async () => {
			const response = await CommentService.GET_COMMENT(product.productID)
			if (response.success) {
				setRate(response.data?.rate || 0)
				setContent(response.data?.content)
				setComment(response.data)
			}
		}

		if (isLoggedIn) {
			fetch()
		}
	}, [product])

	const handleDelete = async () => {
		const res = await CommentService.DELETE_COMMENT(product?.productID)
		if (res.success) {
			enqueueSnackbar('Delete successfully', { variant: 'success' })
			window.location.href = '/product/' + product.productID
			handleClose()
		}
	}

	const handleSubmit = async () => {
		let response

		if (rate <= 0 || !content) {
			enqueueSnackbar('Please pick an rate and enter review to add the comment for the product', {
				variant: 'error',
			})
			return
		}
		const formBody = {
			productID: product.productID,
			rate,
			content,
		}

		if (comment) {
			response = await CommentService.UPDATE_COMMENT(formBody)
		} else {
			response = await CommentService.ADD_COMMENT(formBody)
		}

		if (response.success) {
			enqueueSnackbar(response.message, { variant: 'success' })
			setTimeout(() => {
				window.location.href = '/product/' + product.productID
			}, 2000)
		}
		handleClose()
	}

	return (
		<Dialog open={open}>
			<DialogHeader className='justify-between'>
				<Typography variant='h5'>Review product</Typography>
				<IconButton color='blue-gray' size='sm' variant='text' onClick={handleClose}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
						className='h-5 w-5'
					>
						<path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
					</svg>
				</IconButton>
			</DialogHeader>
			{isLoggedIn ? (
				<>
					<DialogBody>
						{rate !== undefined ? (
							<Rating value={rate} onChange={(value) => setRate(value)} />
						) : (
							<p>Loading...</p>
						)}
						<Textarea
							value={content}
							required
							onChange={(e) => setContent(e.target.value)}
							label='Description review'
						/>
					</DialogBody>
					<DialogFooter className='space-x-2'>
						{comment && (
							<Button variant='gradient' color='red' onClick={handleDelete}>
								Delete
							</Button>
						)}

						<Button variant='gradient' color='gray' onClick={handleSubmit}>
							Submit
						</Button>
					</DialogFooter>
				</>
			) : (
				<DialogBody>Please login to submit a review</DialogBody>
			)}
		</Dialog>
	)
}

export default ReviewDialog
