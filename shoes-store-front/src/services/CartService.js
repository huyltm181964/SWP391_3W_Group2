import { CartRequest } from 'src/requests/CartRequest'
import axiosFormData from 'src/utils/axiosFormData'

export const CartService = {
	ADD_CART: async (formData) =>
		await axiosFormData.post(CartRequest.ADD_CART, formData).then((response) => response),
	GET_CART: async () =>
		await axiosFormData.get(CartRequest.GET_CART).then((response) => response.data),
	DELETE_ITEM: async (variantID) =>
		await axiosFormData
			.delete(CartRequest.DELETE_ITEM + '/' + variantID)
			.then((response) => response),
	UPDATE_ITEM: async (formData) =>
		await axiosFormData.put(CartRequest.UPDATE_ITEM, formData).then((response) => response),
}
