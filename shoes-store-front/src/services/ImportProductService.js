import { ImportProductRequest } from 'src/requests/ImportProductRequest'
import axiosFormBody from '../utils/axiosFormBody'

export const ImportProductService = {
	GET_ALL_PRODUCT: async () =>
		await axiosFormBody.get(ImportProductRequest.GET_ALL_PRODUCT).then((response) => response.data),
}
