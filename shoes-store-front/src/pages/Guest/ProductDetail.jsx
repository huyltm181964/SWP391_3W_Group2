import { Rating } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import ProductDetailInformation from 'src/components/ProductDetail/ProductDetailInformation'
import ReviewDialog from 'src/components/ProductDetail/ReviewDialog'
import UserReview from 'src/components/ProductDetail/UserReview'
import { ProductService } from 'src/services/ProductService'

const ProductDetail = () => {
	const { id } = useParams()

	const [product, setProduct] = useState(null)
	const [openReviewDialog, setOpenReviewDialog] = useState(false)

	useEffect(() => {
		const fetch = async () => {
			const data = await ProductService.GET_DETAIL(id)
			setProduct(data)
		}
		fetch()
	}, [id, openReviewDialog])

	return (
		<section style={{ padding: '2% 5%' }}>
			<ProductDetailInformation product={product} />

			<div class='flex items-center gap-2 mt-5 border-b-gray-500 border-b-2'>
				<h2 class='text-2xl font-semibold text-gray-900 dark:text-white'>Reviews</h2>
			</div>

			<div class='my-5 gap-8 sm:flex sm:items-start'>
				<div class='shrink-0 space-y-4'>
					<button
						type='button'
						onClick={() => setOpenReviewDialog(!openReviewDialog)}
						class='mb-2 me-2 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
					>
						Write a review
					</button>
				</div>
			</div>

			<div class='mt-6 divide-y divide-gray-700 dark:divide-gray-200'>
				{product?.comments?.map((comment) => (
					<UserReview comment={comment} />
				))}
			</div>
			{openReviewDialog && (
				<ReviewDialog
					open={openReviewDialog}
					handleClose={() => setOpenReviewDialog(false)}
					product={product}
				/>
			)}
		</section>
	)
}

export default ProductDetail
