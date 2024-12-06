import { ProductRequest } from 'src/requests/User/ProductRequest'
import axiosFormBody from 'src/utils/axiosFormBody'
import axiosFormData from 'src/utils/axiosFormData'

export const ProductService = {
	GET_ALL: async () =>
		await axiosFormBody.get(ProductRequest.GET_ALL).then((response) => response.data),
	GET_DETAIL: async (productId) =>
		await axiosFormBody
			.get(ProductRequest.GET_DETAIL + productId)
			.then((response) => response.data),
	SEARCH_PRODUCT: async (productName) =>
		await axiosFormBody
			.post(ProductRequest.SEARCH_PRODUCT, productName)
			.then((response) => response.data),
}
