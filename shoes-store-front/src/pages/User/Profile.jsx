import ChangePasswordForm from 'src/components/Profile/ChangePasswordForm'
import UserProfile from 'src/components/Profile/UserProfile'

const Profile = () => {
	return (
		<div className='flex flex-col p-10 gap-5'>
			<UserProfile />
			<ChangePasswordForm />
		</div>
	)
}

export default Profile
