import { ImportProductRequest } from 'src/requests/Staff/ImportProductRequest'
import axiosFormBody from '../../utils/axiosFormBody'
import axiosFormData from 'src/utils/axiosFormData'

export const ImportProductService = {
	GET_ALL_IMPORT: async () =>
		await axiosFormBody.get(ImportProductRequest.GET_ALL_IMPORT).then((response) => response),

	IMPORT_PRODUCT: async (formdata) =>
		await axiosFormBody
			.post(ImportProductRequest.IMPORT_PRODUCT, formdata)
			.then((response) => response.data),

	UPDATE_IMPORT_PRODUCT: async (formdata) =>
		await axiosFormData
			.post(ImportProductRequest.UPDATE_IMPORT_PRODUCT, formdata)
			.then((response) => response.data),

	ADD_PRODUCT: async (product) =>
		await axiosFormData
			.post(ImportProductRequest.ADD_PRODUCT, product)
			.then((response) => response.data),
	GET_ALL_PRODUCTS: async () =>
		await axiosFormBody
			.get(ImportProductRequest.GET_ALL_PRODUCTS)
			.then((response) => response.data),
}
