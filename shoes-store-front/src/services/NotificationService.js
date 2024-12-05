import { NotificationRequest } from 'src/requests/NotificationRequest'
import axiosFormBody from 'src/utils/axiosFormBody'

export const NotificationService = {
	GET_ALL: async () => await axiosFormBody.get(NotificationRequest.GET_ALL).then((res) => res.data),
	GET_NOTIFICATION_DETAIL: async (notificationID) =>
		await axiosFormBody
			.get(NotificationRequest.GET_NOTIFICATION_DETAIL + notificationID)
			.then((res) => res),
	CLEAR: async () => await axiosFormBody.delete(NotificationRequest.CLEAR).then((res) => res),
}
