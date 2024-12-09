import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { AuthService } from 'src/services/User/AuthService'

const axiosFormBody = axios.create({
	baseURL: 'https://localhost:7212/api/v1',
	headers: {
		'content-type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'X-Requested-With',
	},
})

axiosFormBody.interceptors.request.use(
	(request) => {
		const token = localStorage.getItem('token')
		if (token) {
			request.headers.Authorization = `Bearer ${token}`
		}
		return request
	},
	(error) => {
		return Promise.reject(error)
	}
)

axiosFormBody.interceptors.response.use(
	(response) => {
		return response.data
	},
	(error) => {
		const status = error.response?.status
		const message = error.response?.data?.message || 'Error Occured'

		switch (status) {
			case 401:
			case 403:
				enqueueSnackbar(message, { variant: 'error' })
				AuthService.LOGOUT()
				break
			case 400:
			case 404:
			case 409:
			case 500:
				enqueueSnackbar(message, { variant: 'error' })
				break
			default:
				enqueueSnackbar('Error Occured', { variant: 'error' })
				break
		}
		return error.response.data
	}
)

export default axiosFormBody
