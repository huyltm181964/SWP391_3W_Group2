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
	const [answer, setAnswer] = useState(contact?.answer || '')

	return (
		<Accordion open={open} className='bg-gray-200 rounded-lg'>
			<AccordionHeader onClick={() => setOpen(contact?.contactID)}>
				<div class='flex items-center px-3 justify-between w-full gap-2'>
					<Typography
						color={contact?.isRejected ? 'red' : contact?.answer ? 'green' : 'blue'}
						className='font-bold uppercase'
					>
						{contact?.isRejected ? 'Rejected' : contact?.answer ? 'Completed' : 'Awaiting'}
					</Typography>

					<Typography variant='h6'>
						(#{contact?.contactID}) {contact?.title}
					</Typography>

					<Typography className='italic flex-grow'>
						({formatDateTimeWithLetterMonth(contact?.createdDate)})
					</Typography>

					{!contact?.answer && !contact.isRejected && (
						<button
							onClick={() => handleReject(contact?.contactID)}
							type='button'
							className='rounded-full pointer-events-auto cursor-pointer px-7 py-3 bg-red-700 shadow-sm shadow-transparent text-white font-semibold text-sm transition-all duration-500 hover:shadow-red-400 hover:bg-red-900'
						>
							Reject
						</button>
					)}

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

					{contact?.answer ? (
						<>
							<Typography className='font-bold'>
								Answered by <span style={{ color: 'blue' }}>{contact?.answeredStaffName}</span> at{' '}
								<span style={{ color: 'green' }}>
									{formatDateTimeWithLetterMonth(contact?.answerDate)}
								</span>
							</Typography>
							<Typography>{contact?.answer}</Typography>
						</>
					) : !contact?.isRejected ? (
						<Textarea label='Answer' onChange={(e) => setAnswer(e.target.value)} value={answer} />
					) : (
						<Typography className='font-bold'>
							Rejected by <span style={{ color: 'red' }}>{contact?.answeredStaffName}</span> at{' '}
							<span style={{ color: 'darkred' }}>
								{formatDateTimeWithLetterMonth(contact?.answerDate)}
							</span>
						</Typography>
					)}
					{!contact?.answer && !contact.isRejected && (
						<div className='flex justify-end gap-5 mt-2'>
							<Button onClick={() => setAnswer('')} variant='outlined' color='gray'>
								Cancel
							</Button>
							<Button onClick={() => handleAnswer(contact?.contactID, answer)} color='blue'>
								Answer
							</Button>
						</div>
					)}
				</div>
			</AccordionBody>
		</Accordion>
	)
}

export default StaffContactAccordion
