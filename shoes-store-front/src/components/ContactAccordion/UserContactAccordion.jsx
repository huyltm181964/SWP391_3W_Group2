import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { Accordion, AccordionBody, AccordionHeader, Typography } from '@material-tailwind/react'
import { formatDateTimeWithLetterMonth } from 'src/utils/DateUtil'

const UserContactAccordion = ({ open, setOpen, contact }) => {
	return (
		<Accordion open={open} className='bg-white'>
			<AccordionHeader onClick={() => setOpen(contact?.contactID)}>
				<div class='flex items-center px-3 justify-between w-full'>
					<Typography
						color={contact?.isRejected ? 'red' : contact?.answer ? 'green' : 'blue'}
						className='font-bold uppercase mr-2'
					>
						{contact?.isRejected ? 'Rejected' : contact?.answer ? 'Completed' : 'Awaiting'}
					</Typography>
					<Typography variant='h6' className='font-bold flex-grow'>
						{contact?.title}
					</Typography>
					{open ? (
						<ChevronDownIcon className='w-10 h-10' />
					) : (
						<ChevronRightIcon className='w-10 h-10' />
					)}
				</div>
			</AccordionHeader>
			<AccordionBody>
				<div className='p-2'>
					<Typography variant='h6' className='flex items-center gap-2'>
						Your contact
						<Typography className='italic'>
							{formatDateTimeWithLetterMonth(contact?.createdDate)}
						</Typography>
					</Typography>
					<Typography className='p-2'>{contact?.description}</Typography>

					{contact?.answer && (
						<>
							<Typography variant='h6' className='flex items-center gap-2'>
								Answer
								<Typography className='italic'>
									{formatDateTimeWithLetterMonth(contact?.answerDate)}
								</Typography>
							</Typography>
							<Typography className='ml-5 pl-2 border-l-4 border-green-800'>
								{contact?.answer}
							</Typography>
						</>
					)}
				</div>
			</AccordionBody>
		</Accordion>
	)
}

export default UserContactAccordion
