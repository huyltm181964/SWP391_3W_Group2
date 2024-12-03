const getOffsetDate = (offset) => {
	const date = new Date()
	date.setDate(date.getDate() + offset)
	return date.toISOString().split('T')[0]
}

const getDateFromDateTime = (datetime) => {
	const date = new Date(datetime)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

const formatDateWithLetterMonth = (date) =>
	new Date(date).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})

const formatDateTimeWithLetterMonth = (date) =>
	new Date(date).toLocaleString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})

export {
	getOffsetDate,
	getDateFromDateTime,
	formatDateWithLetterMonth,
	formatDateTimeWithLetterMonth,
}
