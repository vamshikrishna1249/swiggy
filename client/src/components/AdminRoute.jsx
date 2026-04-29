import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Loading is handled globally in App.jsx
const AdminRoute = ({ children }) => {
  const { user, profile } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          You need admin privileges to access this page.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <a href="/home" className="btn-outline px-6 py-2.5">← Go Home</a>
          <a href="/login" className="btn-primary px-6 py-2.5">Switch Account</a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
