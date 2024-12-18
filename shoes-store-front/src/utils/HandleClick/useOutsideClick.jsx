import React, { useEffect } from 'react'

const useOutsideClick = (ref, callback) => {
	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				callback()
			}
		}

		document.addEventListener('click', handleOutsideClick)
		return () => document.removeEventListener('click', handleOutsideClick)
	}, [ref, callback])
}

export default useOutsideClick
