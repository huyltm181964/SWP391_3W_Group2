import { Rating } from '@material-tailwind/react'
import React from 'react'
import { formatDateTimeWithLetterMonth } from 'src/utils/DateUtil'

const UserReview = ({ comment }) => {
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
		</div>
	)
}

export default UserReview
