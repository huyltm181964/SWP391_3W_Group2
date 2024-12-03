import { LockClosedIcon, TrashIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Button, Card, CardBody, CardHeader, Input, Typography } from '@material-tailwind/react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import FilterCategory from 'src/components/Product/FilterCategory'
import ProductCard from 'src/components/Product/ProductCard'
import { ProductService } from 'src/services/ProductService'

const Product = () => {
	const [products, setProducts] = useState([])
	const [filteredProducts, setFilteredProducts] = useState(products)
	const [searchName, setSearchName] = useState('')
	const [selectedCategories, setSelectedCategories] = useState([])
	const [visibleProducts, setVisibleProducts] = useState(8)

	useEffect(() => {
		const fetchProduct = async () => {
			if (!searchName) {
				const data = await ProductService.GET_ALL()
				setProducts(
					data.filter((product) => product?.productStatus.toLowerCase() !== 'out of business')
				)
			} else {
				const data = await ProductService.SEARCH_PRODUCT(searchName)
				setProducts(
					data.filter((product) => product?.productStatus.toLowerCase() !== 'out of business')
				)
			}
		}
		fetchProduct()
	}, [searchName])

	useEffect(() => {
		if (selectedCategories.length === 0) {
			setFilteredProducts(products)
		} else {
			setFilteredProducts(
				products.filter((product) => selectedCategories.includes(product.productCategory))
			)
		}
	}, [selectedCategories, products])

	useEffect(() => {
		setVisibleProducts(8)
	}, [filteredProducts])

	const handleSeeMore = () => {
		setVisibleProducts((prev) => prev + 8)
	}

	return (
		<div className='flex justify-between p-4 gap-5'>
			<div className='w-1/6 flex gap-5 flex-col'>
				<Input
					label='Filter by name'
					type='text'
					value={searchName}
					onChange={(e) => setSearchName(e.target.value)}
					icon={
						<XMarkIcon
							opacity={searchName ? 1 : 0}
							className='cursor-pointer'
							onClick={() => setSearchName('')}
						/>
					}
				/>

				<FilterCategory
					selectedCategories={selectedCategories}
					setSelectedCategories={setSelectedCategories}
				/>
			</div>
			<div className='flex flex-col w-5/6'>
				<div className='grid grid-cols-4 gap-5'>
					{filteredProducts?.length !== 0 ? (
						filteredProducts
							.slice(0, visibleProducts)
							.map((product) => <ProductCard key={product.id} product={product} />)
					) : (
						<Typography variant='h4'>No product available</Typography>
					)}
				</div>
				{visibleProducts < filteredProducts.length && (
					<Button variant='outlined' className='mt-5' onClick={handleSeeMore}>
						See More
					</Button>
				)}
			</div>
		</div>
	)
}

export default Product
