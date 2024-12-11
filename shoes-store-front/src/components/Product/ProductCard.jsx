import React from 'react'
import { GetImage } from 'src/utils/GetImage'

const ProductCard = ({ product }) => {
	return (
		<div class='relative flex w-full mx-auto flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md'>
			<a
				class='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'
				href={`/product/${product.productID}`}
			>
				<img class='object-cover w-full' src={GetImage(product.productImg)} alt='product image' />
			</a>
			<div class='mt-4 px-5 pb-5'>
				<a href={`/product/${product.productID}`}>
					<h5 class='text-xl tracking-tight text-slate-900 truncate'>{product.productName}</h5>
				</a>
				<div class='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span class='text-3xl font-bold text-slate-900'>${product.productPrice}</span>
					</p>
					<span className={`mr-2 ml-3 rounded px-2.5 py-0.5 text-sm font-semibold bg-yellow-200`}>
						{product.productCategory}
					</span>
				</div>
				<a
					href={`/product/${product.productID}`}
					class='flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
				>
					View Detail
				</a>
			</div>
		</div>
	)
}

export default ProductCard
