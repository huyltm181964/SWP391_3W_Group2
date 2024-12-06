import { StatisticRequest } from 'src/requests/Admin/StatisticRequest'
import axiosFormBody from 'src/utils/axiosFormBody'

export const StatisticService = {
	TOTAL_COMMENTS: async () =>
		await axiosFormBody.get(StatisticRequest.TOTAL_COMMENTS).then((response) => response),
	TOTAL_USERS: async () =>
		await axiosFormBody.get(StatisticRequest.TOTAL_USERS).then((response) => response),
	TOTAL_ORDERS: async () =>
		await axiosFormBody.get(StatisticRequest.TOTAL_ORDERS).then((response) => response),
	TOTAL_REVENUES: async () =>
		await axiosFormBody.get(StatisticRequest.TOTAL_REVENUES).then((response) => response),
	MONTHLY_REVENUES: async () =>
		await axiosFormBody.get(StatisticRequest.MONTHLY_REVENUES).then((response) => response),
}
