import React, { useEffect, useState } from 'react'
import axios from 'axios'

const LocationSelector = ({ values, setValues, errors }) => {
	const [cities, setCities] = useState([])
	const [districts, setDistricts] = useState([])
	const [wards, setWards] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get(
				'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json'
			)
			setCities(response.data)
		}
		fetchData()
	}, [])

	const handleCityChange = (e) => {
		const cityName = e.target.value
		setValues((prev) => ({
			...prev,
			city: cityName,
			district: '',
			ward: '',
		}))
		setWards([])

		if (cityName) {
			const selectedCityData = cities.find((city) => city.Name === cityName)
			setDistricts(selectedCityData?.Districts || [])
		} else {
			setDistricts([])
		}
	}

	const handleDistrictChange = (e) => {
		const districtName = e.target.value
		setValues((prev) => ({
			...prev,
			district: districtName,
			ward: '',
		}))
		if (districtName) {
			const selectedDistrictData = districts.find((district) => district.Name === districtName)
			setWards(selectedDistrictData?.Wards || [])
		} else {
			setWards([])
		}
	}

	const handleWardChange = (e) => {
		const wardName = e.target.value
		setValues((prev) => ({
			...prev,
			ward: wardName,
		}))
	}

	useEffect(() => {
		if (values.city) {
			const selectedCityData = cities.find((city) => city.Name === values.city)
			setDistricts(selectedCityData?.Districts || [])
			if (values.district) {
				const selectedDistrictData = selectedCityData?.Districts.find(
					(district) => district.Name === values.district
				)
				setWards(selectedDistrictData?.Wards || [])
			}
		}
	}, [values.city, values.district, cities])

	return (
		<div className='flex justify-between gap-4'>
			<div>
				<label>City:</label>
				<select
					id='city'
					value={values.city}
					onChange={handleCityChange}
					className={`border p-2 rounded-[20px] ${
						errors.city ? 'border-red-500' : 'border-gray-300'
					}`}
				>
					<option value=''>Select a city</option>
					{cities.map((city) => (
						<option key={city.Id} value={city.Name}>
							{city.Name}
						</option>
					))}
				</select>
				{errors.city && <div className='text-red-500 text-sm'>{errors.city}</div>}
			</div>

			<div>
				<label>District:</label>
				<select
					id='district'
					value={values.district}
					onChange={handleDistrictChange}
					disabled={!values.city}
					className={`border p-2 rounded-[20px] ${
						errors.district ? 'border-red-500' : 'border-gray-300'
					} ${!values.city ? 'opacity-50 cursor-not-allowed' : ''}`}
				>
					<option value=''>Select a district</option>
					{districts.map((district) => (
						<option key={district.Id} value={district.Name}>
							{district.Name}
						</option>
					))}
				</select>
				{errors.district && <div className='text-red-500 text-sm'>{errors.district}</div>}
			</div>

			<div>
				<label>Ward:</label>
				<select
					id='ward'
					value={values.ward}
					onChange={handleWardChange}
					disabled={!values.district}
					className={`border p-2 rounded-[20px] ${
						errors.ward ? 'border-red-500' : 'border-gray-300'
					} ${!values.district ? 'opacity-50 cursor-not-allowed' : ''}`}
				>
					<option value=''>Select a ward</option>
					{wards.map((ward) => (
						<option key={ward.Id} value={ward.Name}>
							{ward.Name}
						</option>
					))}
				</select>
				{errors.ward && <div className='text-red-500 text-sm'>{errors.ward}</div>}
			</div>
		</div>
	)
}

export default LocationSelector
