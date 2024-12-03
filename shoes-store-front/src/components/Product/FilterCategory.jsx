import { Checkbox } from '@material-tailwind/react'
import React, { useState } from 'react'
import { categoriesList } from 'src/utils/EnumList'

const FilterCategory = ({ selectedCategories, setSelectedCategories }) => {
	const [open, setOpen] = useState(false)

	const handleCategoryChange = (category) => {
		if (selectedCategories.includes(category)) {
			setSelectedCategories(selectedCategories.filter((cat) => cat !== category))
		} else {
			setSelectedCategories([...selectedCategories, category])
		}
	}

	return (
		<div class='flex items-center justify-center flex-col gap-2'>
			<button
				id='dropdownDefault'
				data-dropdown-toggle='dropdown'
				class='text-white w-full justify-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
				type='button'
				onClick={() => setOpen(!open)}
			>
				Filter by category
				<svg
					class='w-4 h-4 ml-2'
					aria-hidden='true'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						stroke-linecap='round'
						stroke-linejoin='round'
						stroke-width='2'
						d='M19 9l-7 7-7-7'
					></path>
				</svg>
			</button>
			<div
				id='dropdown'
				class='z-10 w-full p-3 bg-white rounded-lg shadow dark:bg-gray-700'
				hidden={!open}
			>
				<h6 class='mb-3 text-sm font-medium text-gray-900 dark:text-white'>Category</h6>
				<ul class='space-y-2 text-sm' aria-labelledby='dropdownDefault'>
					{categoriesList.map((category) => (
						<li class='flex items-center'>
							<Checkbox
								label={category}
								checked={selectedCategories.includes(category)}
								onChange={() => handleCategoryChange(category)}
							/>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default FilterCategory
