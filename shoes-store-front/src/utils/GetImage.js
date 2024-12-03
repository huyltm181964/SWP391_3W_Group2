import axios from 'axios'

export const GetImage = (name) => {
	try {
		if (name) {
			return `https://localhost:7212${name}`
		}
	} catch {}

	try {
		return require('../assets/images/default.jpg')
	} catch {
		return null
	}
}

export const GetLogo = () => {
	try {
		return require('../assets/images/logo.png')
	} catch (error) {
		return null
	}
}
