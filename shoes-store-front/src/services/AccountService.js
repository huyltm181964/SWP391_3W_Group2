import { AccountRequest } from '../requests/AccountRequest'
import axiosFormBody from '../utils/axiosFormBody'
import axiosFormData from '../utils/axiosFormData'

export const AccountService = {
	GET_PROFILE: async () =>
		await axiosFormBody.get(AccountRequest.GET_PROFILE).then((response) => response.data),
	CHANGE_PASSWORD: async (formData) =>
		await axiosFormData.put(AccountRequest.CHANGE_PASSWORD, formData).then((response) => response),
	UPDATE_PROFILE: async (formData) =>
		await axiosFormData.put(AccountRequest.UPDATE_PROFILE, formData).then((response) => response),
	ACTIVE_ACCOUNT: async () =>
		await axiosFormBody.put(AccountRequest.ACTIVE_ACCOUNT).then((response) => response.data),
	CONTACT_US: async (formData) =>
		await axiosFormData.post(AccountRequest.CONTACT_US, formData).then((response) => response),
}
