import { StaffOrderRequest } from 'src/requests/Staff/StaffOrderRequest'
import axiosFormBody from '../../utils/axiosFormBody'

export const StaffOrderService = {
	GET_ALL_ORDER: async () =>
		await axiosFormBody.get(StaffOrderRequest.GET_ALL_ORDER).then((response) => response.data),

	CONFIRM_ORDER: async (formBody) =>
		await axiosFormBody
			.post(StaffOrderRequest.CONFIRM_ORDER, formBody)
			.then((response) => response.data),

	COMPLETE_ORDER: async (formBody) =>
		await axiosFormBody
			.post(StaffOrderRequest.COMPLETE_ORDER, formBody)
			.then((response) => response.data),
}
