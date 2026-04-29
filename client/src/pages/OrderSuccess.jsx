import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Package, Home, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;
  const [show, setShow] = useState(false);
  const [eta, setEta] = useState(30);

  useEffect(() => {
    if (!order) { navigate('/home'); return; }
    setTimeout(() => setShow(true), 100);
    // Countdown ETA
    const interval = setInterval(() => {
      setEta((e) => (e > 0 ? e - 1 : 0));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!order) return null;

  const items = order.items || [];
  const statusSteps = [
    { icon: '✅', label: 'Order Placed', done: true },
    { icon: '👨‍🍳', label: 'Preparing', done: false },
    { icon: '🛵', label: 'Out for Delivery', done: false },
    { icon: '🏠', label: 'Delivered', done: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="home" />
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Animated Success Card */}
        <div className={`bg-white rounded-3xl shadow-xl p-8 text-center mb-6 transition-all duration-700 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Animated Checkmark */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute w-24 h-24 bg-green-100 rounded-full animate-pulse-ring" />
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce-in">
              <CheckCircle size={40} className="text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500 mb-6">
            Your order has been confirmed and is being prepared
          </p>

          {/* ETA */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6 inline-flex items-center gap-3">
            <Clock size={20} className="text-primary" />
            <div className="text-left">
              <p className="text-xs text-gray-500">Estimated delivery time</p>
              <p className="font-black text-primary text-xl">{eta} minutes</p>
            </div>
          </div>

          {/* Order ID */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="font-mono text-sm font-bold text-gray-800 bg-gray-50 px-4 py-2 rounded-lg inline-block">
              #{order.id?.slice(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Status Tracker */}
          <div className="flex items-center justify-between mb-8 px-4">
            {statusSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1 transition-all ${
                  step.done ? 'bg-green-100 scale-110' : 'bg-gray-100'
                }`}>
                  {step.icon}
                </div>
                <p className={`text-xs font-medium text-center ${step.done ? 'text-green-600' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {/* Connector */}
                {i < statusSteps.length - 1 && (
                  <div className={`absolute hidden`} />
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/home')}
              className="flex-1 flex items-center justify-center gap-2 btn-outline py-3"
            >
              <Home size={16} /> Go Home
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 flex items-center justify-center gap-2 btn-primary py-3"
            >
              <Package size={16} /> Track Order
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className={`bg-white rounded-3xl shadow-card p-6 transition-all duration-700 delay-200 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.name} × {item.qty}</span>
                <span className="font-semibold text-gray-900">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span><span>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST</span><span>₹{order.tax}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-1 border-t">
              <span>Total Paid</span><span>₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
