import { ContactRequest } from 'src/requests/User/ContactRequest'
import axiosFormBody from 'src/utils/axiosFormBody'

export const ContactService = {
	ADD_CONTACT: async (formBody) =>
		axiosFormBody.post(ContactRequest.ADD_CONTACT, formBody).then((res) => res),
	HISTORY_CONTACT: async (formBody) =>
		axiosFormBody.get(ContactRequest.HISTORY_CONTACT).then((res) => res),
}
