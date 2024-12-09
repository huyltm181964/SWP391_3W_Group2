import { ContactManagementRequest } from 'src/requests/Staff/ContactManagementRequest'
import axiosFormBody from 'src/utils/axiosFormBody'

export const ContactManagementService = {
	GET_ALL: async () =>
		await axiosFormBody.get(ContactManagementRequest.GET_ALL).then((response) => response.data),
	ANSWER: async (formBody) =>
		await axiosFormBody
			.post(ContactManagementRequest.ANSWER, formBody)
			.then((response) => response),
	REJECT: async (contactID) =>
		await axiosFormBody
			.delete(ContactManagementRequest.REJECT + contactID)
			.then((response) => response),
}
