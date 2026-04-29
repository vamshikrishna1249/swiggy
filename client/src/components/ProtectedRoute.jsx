import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Loading is handled globally in App.jsx — by the time this renders, loading is false
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
