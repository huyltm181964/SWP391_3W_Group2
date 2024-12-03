import React from 'react'
import { useNavigate } from 'react-router-dom'

const AboutUs = () => {
	const navigate = useNavigate()

	return (
		<section class='py-24 relative'>
			<div class='w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto'>
				<div class='w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1'>
					<div class='w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex'>
						<div class='w-full flex-col justify-start lg:items-start items-center gap-4 flex'>
							<h2 class='text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center'>
								Step Into Comfort and Style with Our Premium Shoe Collection
							</h2>
							<p class='text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center'>
								Discover a wide range of shoes designed to offer the perfect blend of comfort,
								style, and durability. Whether you're looking for casual sneakers, elegant dress
								shoes, or athletic footwear, we have something for every occasion and lifestyle.
								Elevate your footwear game and walk with confidence.
							</p>
						</div>
						<button
							onClick={() => navigate('/product')}
							class='sm:w-fit w-full px-3.5 py-2 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex'
						>
							<span class='px-1.5 text-white text-sm font-medium leading-6'>Get Started</span>
						</button>
					</div>
					<img
						class='lg:mx-0 mx-auto h-full rounded-3xl object-cover'
						src='https://planomagazine.com/wp-content/uploads/2021/04/Plano-Magazine-Prized-Kicks-sneaker-store-now-open_feature.jpg'
						alt='about Us image'
					/>
				</div>
			</div>
		</section>
	)
}

export default AboutUs
