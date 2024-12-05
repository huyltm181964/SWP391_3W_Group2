import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Button, Rating, Typography } from '@material-tailwind/react'
import { enqueueSnackbar } from 'notistack'
import React from 'react'
import { CommentService } from 'src/services/CommentService'
import { formatDateTimeWithLetterMonth } from 'src/utils/DateUtil'

const UserReview = ({ comment }) => {
	const handleReport = async (accountID, productID) => {
		const formBody = {
			accountID,
			productID,
		}
		const response = await CommentService.REPORT_COMMENT(formBody)
		if (response.success) {
			enqueueSnackbar(response.message, { variant: 'success' })
		}
	}

	return (
		<div className='gap-5 pt-6 pb-3 sm:flex sm:items-start'>
			<div className='shrink-0'>
				<div>
					<p className='text-base font-semibold text-gray-900 dark:text-white'>
						{comment?.account?.accountName}
					</p>
					<p className='text-sm font-normal text-gray-500 dark:text-gray-400'>
						{formatDateTimeWithLetterMonth(comment?.createdDate)}
					</p>
				</div>
			</div>
			{comment ? <Rating value={comment?.rate} readonly /> : <p>Loading...</p>}
			<div className='mt-4 min-w-0 flex-1 space-y-4 sm:mt-0'>
				<p className='text-base font-normal text-gray-700 dark:text-gray-400'>{comment?.content}</p>
			</div>
			<Button
				onClick={() => handleReport(comment?.accountID, comment?.productID)}
				variant='outlined'
				className='flex justify-between gap-2 items-center p-2'
			>
				<InformationCircleIcon className='w-5 h-5' />
				<Typography className='text-xs'>Report</Typography>
			</Button>
		</div>
	)
}

export default UserReview
