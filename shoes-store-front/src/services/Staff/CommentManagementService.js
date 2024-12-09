import { CommentManagementRequest } from 'src/requests/Staff/CommentManagementRequest'
import axiosFormBody from '../../utils/axiosFormBody'

export const CommentManagementService = {
	GET_ALL: async () =>
		await axiosFormBody.get(CommentManagementRequest.GET_ALL).then((response) => response.data),

	UNREPORT_COMMENT: async (formBody) =>
		await axiosFormBody
			.post(CommentManagementRequest.UNREPORT_COMMENT, formBody)
			.then((response) => response),

	BAN_COMMENT: async (formBody) =>
		await axiosFormBody
			.post(CommentManagementRequest.BAN_COMMENT, formBody)
			.then((response) => response),
}
