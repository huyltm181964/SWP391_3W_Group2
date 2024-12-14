import { Card, CardBody, Option, Select, Typography } from '@material-tailwind/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import StaffContactAccordion from 'src/components/ContactAccordion/StaffContactAccordion'
import UserContactAccordion from 'src/components/ContactAccordion/UserContactAccordion'
import { ContactManagementService } from 'src/services/Staff/ContactManagementService'

const ContactManagement = () => {
	const [contacts, setContacts] = useState([])
	const [open, setOpen] = useState(0)
	const [contactStatus, setContactStatus] = useState('')
	const [isEvent, setIsEvent] = useState(false)

	useEffect(() => {
		const fetch = async () => {
			const data = await ContactManagementService.GET_ALL()
			if (data) setContacts(data)
		}
		fetch()
	}, [isEvent])

	const handleReject = async (contactID) => {
		const response = await ContactManagementService.REJECT(contactID)
		if (response?.success) {
			enqueueSnackbar(response.message, { variant: 'success' })
			setIsEvent(!isEvent)
			setOpen(0)
		}
	}

	const handleAnswer = async (contactID, answer) => {
		const formBody = {
			contactID,
			answer,
		}
		const response = await ContactManagementService.ANSWER(formBody)
		if (response?.success) {
			enqueueSnackbar(response.message, { variant: 'success' })
			setIsEvent(!isEvent)
			setOpen(0)
		}
	}

	const handleOpen = (value) => setOpen(open === value ? 0 : value)

	const filteredContacts = (() => {
		switch (contactStatus) {
			case 'awaiting':
				return contacts.filter((c) => !c.answer && !c.isRejected)
			case 'completed':
				return contacts.filter((c) => !!c.answer)
			case 'rejected':
				return contacts.filter((c) => c.isRejected)
			default:
				return contacts
		}
	})()

	return (
		<section className='m-10'>
			<Card className='h-full w-full'>
				<CardBody className='flex flex-col gap-5'>
					<Typography variant='h3' color='blue-gray'>
						Contact Management
					</Typography>
					<Select label='Contact status' value={contactStatus} onChange={setContactStatus}>
						<Option value='' defaultChecked>
							All contact
						</Option>
						<Option value='awaiting'>Awaiting</Option>
						<Option value='completed'>Completed</Option>
						<Option value='rejected'>Rejected</Option>
					</Select>
					<div className='flex flex-col gap-5'>
						{filteredContacts.length !== 0 ? (
							filteredContacts.map((contact) => (
								<StaffContactAccordion
									open={open === contact.contactID}
									setOpen={handleOpen}
									contact={contact}
									handleReject={handleReject}
									handleAnswer={handleAnswer}
									key={contact}
								/>
							))
						) : (
							<Typography variant='h5'>No contacts</Typography>
						)}
					</div>
				</CardBody>
			</Card>
		</section>
	)
}

export default ContactManagement
