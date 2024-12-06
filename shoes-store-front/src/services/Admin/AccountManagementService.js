import { AccountManagementRequest } from 'src/requests/Admin/AccountManagementRequest'
import axiosFormBody from '../../utils/axiosFormBody'
import axiosFormData from 'src/utils/axiosFormData'

export const AccountManagementService = {
	GET_ALL: async () =>
		await axiosFormBody.get(AccountManagementRequest.GET_ALL).then((response) => response.data),

	UPDATE_STATUS: async (email) =>
		await axiosFormBody
			.post(AccountManagementRequest.UPDATE_STATUS, email)
			.then((response) => response.data),
}
