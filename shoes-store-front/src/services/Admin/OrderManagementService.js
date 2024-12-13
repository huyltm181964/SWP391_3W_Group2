import { OrderManagementRequest } from 'src/requests/Admin/OrderManagementRequest'
import axiosFormBody from '../../utils/axiosFormBody'
import axiosFormData from 'src/utils/axiosFormData'

export const OrderManagementService = {
	GET_DELIVERY_ORDER: async () =>
		await axiosFormBody
			.get(OrderManagementRequest.GET_DELIVERY_ORDER)
			.then((response) => response.data),
}
