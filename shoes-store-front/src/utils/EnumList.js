const categoriesList = ['Bitis', 'Nike', 'Adidas', 'Gucci']

const categoriesTab = ['All', ...categoriesList]

const orderStatusEnum = {
	UNPAID: 'Unpaid',
	ORDERED: 'Ordered',
	DELIVERY: 'Delivery',
	DELIVERIED: 'Deliveried',
	COMPLETED: 'Completed',
}

export { categoriesList, categoriesTab, orderStatusEnum }
