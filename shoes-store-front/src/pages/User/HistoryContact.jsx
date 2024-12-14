import { Option, Select, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import UserContactAccordion from 'src/components/ContactAccordion/UserContactAccordion'
import { ContactService } from 'src/services/User/ContactService'

const HistoryContact = () => {
	const [historyContact, setHistoryContact] = useState([])
	const [open, setOpen] = useState(0)
	const [contactStatus, setContactStatus] = useState('')

	useEffect(() => {
		const fetch = async () => {
			const response = await ContactService.HISTORY_CONTACT()
			if (response?.success) setHistoryContact(response.data)
		}
		fetch()
	}, [])

	const handleOpen = (value) => setOpen(open === value ? 0 : value)

	const filteredContacts = (() => {
		switch (contactStatus) {
			case 'awaiting':
				return historyContact.filter((c) => !c.answer && !c.isRejected)
			case 'completed':
				return historyContact.filter((c) => !!c.answer)
			case 'rejected':
				return historyContact.filter((c) => c.isRejected)
			default:
				return historyContact
		}
	})()

	return (
		<div className='p-4 flex flex-col gap-5'>
			<h2 className='text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl'>
				History Contact
			</h2>
			<div className='w-96 ml-5'>
				<Select label='Contact status' value={contactStatus} onChange={setContactStatus}>
					<Option value='' defaultChecked>
						All contact
					</Option>
					<Option value='awaiting'>Awaiting</Option>
					<Option value='completed'>Completed</Option>
					<Option value='rejected'>Rejected</Option>
				</Select>
			</div>
			<div className='ml-5 flex flex-col gap-5'>
				{filteredContacts.length !== 0 ? (
					filteredContacts.map((contact) => (
						<UserContactAccordion
							open={open === contact.contactID}
							setOpen={handleOpen}
							contact={contact}
							key={contact}
						/>
					))
				) : (
					<Typography variant='h4'>No contact has been sended</Typography>
				)}
			</div>
		</div>
	)
}

export default HistoryContact
