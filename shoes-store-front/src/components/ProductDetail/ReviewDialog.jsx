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
import { CommentService } from 'src/services/CommentService'

const ReviewDialog = ({ open, handleClose, product }) => {
	const isLoggedIn = !!localStorage.getItem('token')

	const [comment, setComment] = useState({})
	const [content, setContent] = useState('')

	useEffect(() => {
		const fetch = async () => {
			const response = await CommentService.GET_COMMENT(product.productID)
			if (response.success) {
				setComment(response.data)
				setContent(response.data.content)
			}
		}

		if (isLoggedIn) {
			fetch()
		}
	}, [product])

	const handleDelete = async () => {
		const res = await CommentService.DELETE_COMMENT(comment?.commentID)
		if (res.success) {
			enqueueSnackbar('Delete successfully', { variant: 'success' })
			handleClose()
		}
	}

	const handleSubmit = async () => {
		if (comment && comment?.commentID !== 0) {
			const formBody = {
				commentID: comment.commentID,
				content,
			}

			await CommentService.UPDATE_COMMENT(formBody)
		} else {
			const formBody = {
				userID: 0,
				productID: product.productID,
				content,
			}

			await CommentService.ADD_COMMENT(formBody)
		}

		enqueueSnackbar('Comment successfully', { variant: 'success' })
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
						<Textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							label='Description review'
						/>
					</DialogBody>
					<DialogFooter className='space-x-2'>
						{comment && comment.commentID !== 0 && (
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
				<DialogBody>Please login submit a review</DialogBody>
			)}
		</Dialog>
	)
}

export default ReviewDialog
