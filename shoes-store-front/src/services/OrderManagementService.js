import { OrderManagementRequest } from 'src/requests/OrderManagementRequest'
import axiosFormBody from '../utils/axiosFormBody'

export const OrderManagementService = {
	GET_ALL: async () =>
		await axiosFormBody.get(OrderManagementRequest.GET_ALL).then((response) => response.data),

	UPDATE_ORDER: async (orderId) =>
		await axiosFormBody
			.post(OrderManagementRequest.UPDATE_ORDER, orderId)
			.then((response) => response.data),
}
