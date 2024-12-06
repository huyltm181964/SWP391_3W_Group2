import { VariantManagementRequest } from 'src/requests/Admin/VariantManagementRequest'
import axiosFormBody from 'src/utils/axiosFormBody'
import axiosFormData from 'src/utils/axiosFormData'

export const VariantManagementService = {
	ADD_VARIANT: async (variant) =>
		await axiosFormData
			.post(VariantManagementRequest.ADD_VARIANT, variant)
			.then((response) => response.data),

	UPDATE_VARIANT: async (variant) =>
		await axiosFormData
			.post(VariantManagementRequest.UPDATE_PRODUCT, variant)
			.then((response) => response.data),

	DELETE_VARIANT: async (variantId) =>
		await axiosFormBody
			.post(VariantManagementRequest.DELETE_VARIANT, variantId)
			.then((response) => response.data),

	RESTOCK: async (restockProduct) =>
		await axiosFormBody
			.post(VariantManagementRequest.RESTOCK, restockProduct)
			.then((response) => response.data),
}
