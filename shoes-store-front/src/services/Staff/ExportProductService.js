import axiosFormBody from '../../utils/axiosFormBody'
import { ExportProductRequest } from 'src/requests/Staff/ExportProductService'

export const ExportProductService = {
	GET_ORDERED_ORDER: async () =>
		await axiosFormBody
			.get(ExportProductRequest.GET_ORDERED_ORDER)
			.then((response) => response.data),

	EXPORT_PRODUCT: async (formBody) =>
		await axiosFormBody
			.post(ExportProductRequest.EXPORT_PRODUCT, formBody)
			.then((response) => response.data),

	EXPORT_ALL_PRODUCT: async (formBody) =>
		await axiosFormBody
			.post(ExportProductRequest.EXPORT_ALL_PRODUCT, formBody)
			.then((response) => response.data),
}
