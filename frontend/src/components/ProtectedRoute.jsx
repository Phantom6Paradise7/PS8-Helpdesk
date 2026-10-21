import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user, allowedRoles }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = (user.role || '').toLowerCase();

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map(r => (r || '').toLowerCase());
    if (!normalizedAllowed.includes(role)) {
      const redirectPath = role === 'customer' ? '/tickets' : '/admin/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;