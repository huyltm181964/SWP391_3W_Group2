import { Rating } from '@material-tailwind/react'
import React from 'react'

const UserReview = ({ comment }) => {
	return (
		<div class='gap-3 pt-6 pb-3 sm:flex sm:items-start'>
			<div class='shrink-0 sm:w-48 md:w-72'>
				<div>
					<p class='text-base font-semibold text-gray-900 dark:text-white'>
						{comment?.account?.accountName}
					</p>
					<p class='text-sm font-normal text-gray-500 dark:text-gray-400'>{comment?.createdDate}</p>
				</div>
			</div>

			<div class='mt-4 min-w-0 flex-1 space-y-4 sm:mt-0'>
				<p class='text-base font-normal text-gray-700 dark:text-gray-400'>{comment?.content}</p>
			</div>
		</div>
	)
}

export default UserReview
