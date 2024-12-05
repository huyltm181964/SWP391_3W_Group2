import { CommentRequest } from 'src/requests/CommentRequest'
import axiosFormBody from 'src/utils/axiosFormBody'

export const CommentService = {
	ADD_COMMENT: async (formBody) =>
		await axiosFormBody.post(CommentRequest.ADD_COMMENT, formBody).then((response) => response),
	GET_COMMENT: async (productID) =>
		await axiosFormBody
			.get(`${CommentRequest.GET_COMMENT}?productID=${productID}`)
			.then((response) => response),
	DELETE_COMMENT: async (commentID) =>
		await axiosFormBody
			.delete(CommentRequest.DELETE_COMMENT + '/' + commentID)
			.then((response) => response),
	UPDATE_COMMENT: async (formBody) =>
		await axiosFormBody.put(CommentRequest.UPDATE_COMMENT, formBody).then((response) => response),
	REPORT_COMMENT: async (formBody) =>
		await axiosFormBody.post(CommentRequest.REPORT_COMMENT, formBody).then((response) => response),
}
