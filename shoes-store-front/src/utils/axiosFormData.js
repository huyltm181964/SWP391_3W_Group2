import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { AuthService } from 'src/services/User/AuthService'

const axiosFormData = axios.create({
	baseURL: 'https://localhost:7212/api/v1',
	headers: {
		'Content-Type': 'multipart/form-data',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'X-Requested-With',
	},
})

axiosFormData.interceptors.request.use(
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

axiosFormData.interceptors.response.use(
	(response) => {
		return response.data
	},
	(error) => {
		const status = error.response?.status
		const message = error.response?.data?.message || 'Error Occured'

		switch (status) {
			case 401:
			case 403:
				enqueueSnackbar('Unauthorized', { variant: 'error' })
				AuthService.LOGOUT()
				break
			case 400:
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

export default axiosFormData
