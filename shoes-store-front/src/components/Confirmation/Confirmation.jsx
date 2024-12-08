import React, { useState } from 'react'

const Confirmation = ({ title, description, handleConfirm, children, reason }) => {
	const [open, setOpen] = useState(false)
	const [reasonValue, setReasonValue] = useState('')
	const [error, setError] = useState(false)

	const handleOpen = () => {
		setOpen(true)
		setError(false) // Reset error state when dialog opens
	}

	const handleClose = () => {
		setOpen(false)
		setReasonValue('')
		setError(false) // Reset error state when dialog closes
	}

	const confirmRequest = () => {
		if (reason && reasonValue.trim() === '') {
			setError(true) // Show error message
			return
		}
		handleConfirm(reasonValue)
		handleClose()
	}

	const handleReasonChange = (e) => {
		setReasonValue(e.target.value)
		setError(false) // Clear error message on input
	}

	return (
		<>
			{children(handleOpen)}
			{open && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
					onClick={handleClose}
				>
					<div
						className='bg-white rounded-lg shadow-lg w-96 p-6'
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className='text-xl font-semibold text-center mb-4'>{title}</h2>
						<p className='text-gray-700 text-center mb-6'>{description}</p>
						{reason && (
							<div className='mb-4'>
								<label htmlFor='reason' className='block text-center font-medium text-gray-700'>
									Reason to ban
								</label>
								<textarea
									id='reason'
									name='reason'
									value={reasonValue}
									onChange={handleReasonChange}
									rows={3}
									className={`mt-1 block w-full rounded-md border ${
										error ? 'border-red-500' : 'border-gray-300'
									} shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
									required
								/>
								{error && (
									<p className='mt-1 text-sm text-red-500'>
										Reason is required. Please provide a valid input.
									</p>
								)}
							</div>
						)}
						<div className='flex justify-around'>
							<button
								className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
								onClick={confirmRequest}
							>
								Yes
							</button>
							<button
								className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600'
								onClick={handleClose}
							>
								No
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default Confirmation
