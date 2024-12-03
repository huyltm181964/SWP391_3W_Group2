import { Tabs, Tab } from '@material-tailwind/react'

const CrudTabs = ({ children, value, handleChange }) => {
	return (
		<div>
			<Tabs value={value} onChange={handleChange} className='flex flex-col'>
				<div className='flex justify-around border-b pb-2'>
					{children.map((child, index) => (
						<Tab
							key={index}
							active={value === index}
							onClick={() => handleChange(index)}
							className={`cursor-pointer px-4 py-2 rounded-t-md transition-all ${
								value === index ? 'bg-white text-black' : 'bg-gray-200 text-black hover:bg-gray-300'
							} ${value === index ? 'active-tab' : ''}`}
						>
							{child.props.label}
						</Tab>
					))}
				</div>

				<div>
					{children.map((child, index) =>
						value === index ? <div key={index}>{child}</div> : null
					)}
				</div>
			</Tabs>
		</div>
	)
}

export default CrudTabs
