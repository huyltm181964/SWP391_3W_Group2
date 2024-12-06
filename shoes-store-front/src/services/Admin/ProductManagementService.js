import { ProductManagementRequest } from 'src/requests/Admin/ProductManagementRequest'
import axiosFormBody from '../../utils/axiosFormBody'
import axiosFormData from 'src/utils/axiosFormData'

export const ProductManagementService = {
	ADD_PRODUCT: async (product) =>
		await axiosFormData
			.post(ProductManagementRequest.ADD_PRODUCT, product)
			.then((response) => response.data),

	GET_ALL: async () =>
		await axiosFormBody.get(ProductManagementRequest.GET_ALL).then((response) => response.data),

	UPDATE_PRODUCT: async (product) =>
		await axiosFormData
			.post(ProductManagementRequest.UPDATE_PRODUCT, product)
			.then((response) => response.data),

	DELETE_PRODUCT: async (productId) =>
		await axiosFormBody
			.post(ProductManagementRequest.DELETE_PRODUCT, productId)
			.then((response) => response.data),

	GET_DETAIL: async (productId) =>
		await axiosFormBody
			.get(ProductManagementRequest.GET_DETAIL + productId)
			.then((response) => response.data),
}
