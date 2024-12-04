import { OrderManagementRequest } from 'src/requests/OrderManagementRequest'
import axiosFormBody from '../utils/axiosFormBody'
import axiosFormData from 'src/utils/axiosFormData'

export const OrderManagementService = {
	GET_ALL: async () =>
		await axiosFormBody.get(OrderManagementRequest.GET_ALL).then((response) => response.data),

	UPDATE_ORDER: async (orderId, orderStatus) => {
		const requestBody = { orderId, orderStatus }
		await axiosFormData
			.post(OrderManagementRequest.UPDATE_ORDER, requestBody)
			.then((response) => response.data)
	},
}
