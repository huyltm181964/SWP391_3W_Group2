import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ role, allowedRole, redirectPath, children }) => {
	if (role?.toLowerCase() !== allowedRole) {
		return <Navigate to={redirectPath} replace />
	}
	return children
}

const RoleRedirect = ({ role, children }) => {
	const location = useLocation()

	if (role?.toLowerCase() === 'admin' && location.pathname !== '/dashboard') {
		return <Navigate to='/dashboard' replace />
	}

	if (role?.toLowerCase() === 'staff' && location.pathname !== '/staff/dashboard') {
		return <Navigate to='/staff/dashboard' replace />
	}

	return children
}

export { ProtectedRoute, RoleRedirect }
