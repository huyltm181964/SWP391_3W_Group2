import { Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import UserContactAccordion from 'src/components/ContactAccordion/UserContactAccordion'
import { ContactService } from 'src/services/User/ContactService'

const HistoryContact = () => {
	const [historyContact, setHistoryContact] = useState([])
	const [open, setOpen] = useState(0)

	useEffect(() => {
		const fetch = async () => {
			const response = await ContactService.HISTORY_CONTACT()
			if (response?.success) setHistoryContact(response.data)
		}
		fetch()
	}, [])

	const handleOpen = (value) => setOpen(open === value ? 0 : value)

	return (
		<div className='p-4 flex flex-col gap-2'>
			<h2 className='text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl'>
				History Contact
			</h2>
			<div className='ml-5'>
				{historyContact.length !== 0 ? (
					historyContact.map((contact) => (
						<UserContactAccordion
							open={open}
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
