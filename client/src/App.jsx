import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const App = () => {
  const { user, loading } = useAuth();

  // While auth is resolving, show a global spinner so routes don't race
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Loading swiggy<span className="text-primary">.</span></p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes — redirect to /home if already logged in */}
      <Route path="/"       element={user ? <Navigate to="/home" replace /> : <Landing />} />
      <Route path="/login"  element={user ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <Signup />} />

      {/* Protected Routes — requires login */}
      <Route path="/home"           element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetail /></ProtectedRoute>} />
      <Route path="/cart"           element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/order-success"  element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
      <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/orders"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Admin Route — requires admin role */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="text-8xl mb-6">🍔</div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">404 — Page Not Found</h1>
          <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
          <a href="/" className="btn-primary px-8 py-3">Go Home</a>
        </div>
      } />
    </Routes>
  );
};

export default App;
