import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	Button,
	Textarea,
	Typography,
} from '@material-tailwind/react'
import { useState } from 'react'
import { formatDateTimeWithLetterMonth } from 'src/utils/DateUtil'

const StaffContactAccordion = ({ open, setOpen, contact, handleReject, handleAnswer }) => {
	const [answer, setAnswer] = useState('')

	return (
		<Accordion open={open} className='bg-gray-200 rounded-lg'>
			<AccordionHeader onClick={() => setOpen(contact?.contactID)}>
				<div class='flex items-center px-3 justify-between w-full gap-2'>
					<Typography variant='h6'>{contact?.title}</Typography>

					<Typography className='italic flex-grow'>
						({formatDateTimeWithLetterMonth(contact?.createdDate)})
					</Typography>

					<button
						onClick={() => handleReject(contact?.contactID)}
						type='button'
						className='rounded-full pointer-events-auto cursor-pointer px-7 py-3 bg-red-700 shadow-sm shadow-transparent text-white font-semibold text-sm transition-all duration-500 hover:shadow-red-400 hover:bg-red-900'
					>
						Reject
					</button>

					{open ? (
						<ChevronDownIcon className='w-10 h-10' />
					) : (
						<ChevronRightIcon className='w-10 h-10' />
					)}
				</div>
			</AccordionHeader>
			<AccordionBody>
				<div className='px-[2%]'>
					<Typography className='font-bold'>Description:</Typography>
					<Typography>{contact?.description}</Typography>
					<Textarea label='Answer' onChange={(e) => setAnswer(e.target.value)} value={answer} />
					<div className='flex justify-end gap-5 mt-2'>
						<Button onClick={() => setAnswer('')} variant='outlined' color='gray'>
							Cancel
						</Button>
						<Button onClick={() => handleAnswer(contact?.contactID, answer)} color='blue'>
							Answer
						</Button>
					</div>
				</div>
			</AccordionBody>
		</Accordion>
	)
}

export default StaffContactAccordion
