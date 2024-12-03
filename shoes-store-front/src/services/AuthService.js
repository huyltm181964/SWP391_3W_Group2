import axios from 'axios'
import { AuthRequest } from '../requests/AuthRequest'
import axiosFormBody from '../utils/axiosFormBody'

export const AuthService = {
	LOGIN: async (formBody) =>
		await axiosFormBody.post(AuthRequest.LOGIN, formBody).then((response) => response),
	REGISTER: async (formBody) =>
		await axiosFormBody.post(AuthRequest.REGISTER, formBody).then((response) => response),
	SEND_MAIL: async (accountEmail) =>
		await axiosFormBody.post(AuthRequest.SEND_MAIL, accountEmail).then((response) => response),
	LOGOUT: () => {
		localStorage.removeItem('token')
		localStorage.removeItem('role')
		window.location.href = '/'
	},
	GET_GOOGLE_PROFILE: async (token) =>
		await axios
			.get(AuthRequest.GET_GOOGLE_PROFILE + token, {
				headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
			})
			.then((response) => response.data),
	LOGIN_WITH_GOOGLE: async (formData) =>
		await axiosFormBody.post(AuthRequest.LOGIN_WITH_GOOGLE, formData).then((response) => response),
}
