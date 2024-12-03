import React, { useState } from 'react'

const Confirmation = ({ title, description, handleConfirm, children }) => {
	const [open, setOpen] = useState(false)

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const confirmRequest = () => {
		handleConfirm()
		handleClose()
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
