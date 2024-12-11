import { Card, CardBody, Typography } from '@material-tailwind/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import StaffContactAccordion from 'src/components/ContactAccordion/StaffContactAccordion'
import UserContactAccordion from 'src/components/ContactAccordion/UserContactAccordion'
import { ContactManagementService } from 'src/services/Staff/ContactManagementService'

const ContactManagement = () => {
	const [contacts, setContacts] = useState([])
	const [open, setOpen] = useState(0)
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
	return (
		<section className='m-10'>
			<Card className='h-full w-full'>
				<CardBody>
					<div className='rounded-none flex flex-wrap gap-4 justify-between mb-4'>
						<div>
							<Typography variant='h3' color='blue-gray'>
								Contact Management
							</Typography>
						</div>
					</div>
					<div className='flex flex-col gap-5'>
						{contacts.length !== 0 ? (
							contacts.map((contact) => (
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
