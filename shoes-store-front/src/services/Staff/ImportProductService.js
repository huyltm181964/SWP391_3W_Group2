import { ImportProductRequest } from 'src/requests/Staff/ImportProductRequest'
import axiosFormBody from '../../utils/axiosFormBody'
import axiosFormData from 'src/utils/axiosFormData'

export const ImportProductService = {
	GET_ALL_PRODUCT: async () =>
		await axiosFormBody.get(ImportProductRequest.GET_ALL_PRODUCT).then((response) => response.data),

	GET_PRODUCT_DETAIL: async (productId) =>
		await axiosFormBody
			.get(ImportProductRequest.GET_PRODUCT_DETAIL + productId)
			.then((response) => response.data),

	GET_STOCK_HISTORY: async (variantId) =>
		await axiosFormBody
			.get(ImportProductRequest.GET_STOCK_HISTORY + variantId)
			.then((response) => response.data),

	IMPORT_PRODUCT: async (formdata) =>
		await axiosFormData
			.post(ImportProductRequest.IMPORT_PRODUCT, formdata)
			.then((response) => response.data),

	UPDATE_IMPORT_PRODUCT: async (formdata) =>
		await axiosFormData
			.post(ImportProductRequest.UPDATE_IMPORT_PRODUCT, formdata)
			.then((response) => response.data),
}