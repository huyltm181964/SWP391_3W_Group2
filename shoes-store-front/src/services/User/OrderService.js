import { OrderRequest } from 'src/requests/User/OrderRequest'
import axiosFormBody from 'src/utils/axiosFormBody'

export const OrderService = {
	CHECK_OUT: async (formData) =>
		await axiosFormBody.post(OrderRequest.CHECK_OUT, formData).then((response) => response),
	GET_HISTORY_ORDER: async () =>
		await axiosFormBody.get(OrderRequest.GET_HISTORY_ORDER).then((response) => response.data),
	CANCEL_ORDER: async (orderID) =>
		await axiosFormBody
			.delete(OrderRequest.CANCEL_ORDER + '/' + orderID)
			.then((response) => response),
	GET_PAYMENT_URL: async (orderID) =>
		await axiosFormBody
			.get(OrderRequest.GET_PAYMENT_URL + '/' + orderID)
			.then((response) => response),
	CONFIRM_ORDER: async (orderID) =>
		await axiosFormBody.post(OrderRequest.CONFIRM_ORDER, orderID).then((response) => response),
}
