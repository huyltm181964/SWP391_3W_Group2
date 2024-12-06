import React, { useEffect, useState } from 'react'
import axios from 'axios'

const LocationSelector = ({ values, setValues, errors }) => {
	const [cities, setCities] = useState([])
	const [districts, setDistricts] = useState([])
	const [wards, setWards] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json'
				)
				setCities(response.data)
			} catch (error) {
				console.error('Error fetching data:', error)
			}
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

	return (
		<div>
			<div>
				<label htmlFor='city'>City:</label>
				<select
					id='city'
					value={values.city}
					onChange={handleCityChange}
					className={errors.city ? 'error' : ''}
				>
					<option value=''>Select a city</option>
					{cities.map((city) => (
						<option key={city.Id} value={city.Name}>
							{city.Name}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor='district'>District:</label>
				<select
					id='district'
					value={values.district}
					onChange={handleDistrictChange}
					disabled={!values.city}
					className={errors.district ? 'error' : ''}
				>
					<option value=''>Select a district</option>
					{districts.map((district) => (
						<option key={district.Id} value={district.Name}>
							{district.Name}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor='ward'>Ward:</label>
				<select
					id='ward'
					value={values.ward}
					onChange={handleWardChange}
					disabled={!values.district}
					className={errors.ward ? 'error' : ''}
				>
					<option value=''>Select a ward</option>
					{wards.map((ward) => (
						<option key={ward.Id} value={ward.Name}>
							{ward.Name}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}

export default LocationSelector
