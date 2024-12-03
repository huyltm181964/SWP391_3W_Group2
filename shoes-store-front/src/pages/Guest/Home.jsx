import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
	const navigate = useNavigate()

	return (
		<div
			class='relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden'
			style={{ height: '90vh' }}
		>
			<div class='absolute inset-0'>
				<img
					src='https://static.vecteezy.com/system/resources/thumbnails/023/219/700/small_2x/table-with-stack-of-stylish-sweaters-and-woman-s-shoes-on-grey-background-generative-ai-photo.jpg'
					alt='Background Image'
					class='object-cover object-center w-full h-full'
				/>
				<div class='absolute inset-0 bg-black opacity-50'></div>
			</div>

			<div class='relative z-10 flex flex-col justify-center items-center h-full text-center'>
				<h1 class='text-5xl font-bold leading-tight mb-4'>Welcome to Our Awesome Website</h1>
				<p class='text-lg text-gray-300 mb-8'>
					Discover amazing features and services that await you.
				</p>
				<a
					onClick={() => navigate('/product')}
					class='bg-yellow-400 cursor-pointer text-gray-900 hover:bg-yellow-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'
				>
					Get Started
				</a>
			</div>
		</div>
	)
}

export default Home
