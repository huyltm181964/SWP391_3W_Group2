const getAvarage = (listNumber) => {
	if (!listNumber || listNumber.length === 0) return 0

	const total = listNumber.reduce((sum, num) => sum + num, 0)
	return total / listNumber.length
}

export { getAvarage }
