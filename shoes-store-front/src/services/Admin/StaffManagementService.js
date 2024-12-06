import axiosFormData from 'src/utils/axiosFormData'
import axiosFormBody from '../../utils/axiosFormBody'
import { StaffManagementRequest } from 'src/requests/Admin/StaffManagementRequest'

export const StaffManagementService = {
	GET_ALL_STAFFS: async () =>
		await axiosFormBody
			.get(StaffManagementRequest.GET_ALL_STAFFS)
			.then((response) => response.data),

	ADD_STAFF: async (account) =>
		await axiosFormData
			.post(StaffManagementRequest.ADD_STAFF, account)
			.then((response) => response.data),

	UPDATE_STAFF_INFO: async (account) =>
		await axiosFormData
			.post(StaffManagementRequest.UPDATE_STAFF_INFO, account)
			.then((response) => response.data),

	UPDATE_STAFF_STATUS: async (email) =>
		await axiosFormBody
			.post(StaffManagementRequest.UPDATE_STAFF_STATUS, email)
			.then((response) => response.data),
}
