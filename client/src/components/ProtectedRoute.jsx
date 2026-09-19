import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Wrap any <Route> in AppRoutes with this to require login.
// See the commented-out example in AppRoutes.jsx.
export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-status">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
