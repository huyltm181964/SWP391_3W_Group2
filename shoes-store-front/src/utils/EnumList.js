const categoriesList = ['Bitis', 'Nike', 'Adidas', 'Gucci']

const categoriesTab = ['All', ...categoriesList]

const orderStatusEnum = {
	UNPAID: 'Unpaid',
	ORDERED: 'Ordered',
	CONFIRMED: 'Confirmed',
	COMPLETED: 'Completed',
}

export { categoriesList, categoriesTab, orderStatusEnum }
