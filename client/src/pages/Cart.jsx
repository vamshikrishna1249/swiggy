import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Tag, ChevronRight, Plus, Trash2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { placeOrder, validateCoupon } from '../services/api';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, totalItems, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: 'Home', street: '', city: '', pincode: '' });

  useEffect(() => {
    if (user) loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    if (!user?.id || user.id.startsWith('demo-')) { setAddresses([]); return; }
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id);
    setAddresses(data || []);
    const def = data?.find((a) => a.is_default) || data?.[0];
    if (def) setSelectedAddress(def.id);
  };

  const handleCoupon = async () => {
    if (!couponCode) return;
    setCouponError('');
    try {
      const res = await validateCoupon(couponCode, subtotal);
      setCouponData(res);
      toast.success(`Coupon applied! You save ₹${res.discount} 🎉`);
    } catch (err) {
      setCouponError(err.message);
      setCouponData(null);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddr.street || !newAddr.city || !newAddr.pincode) {
      toast.error('Fill in all address fields');
      return;
    }
    const { data, error } = await supabase.from('addresses').insert([{
      ...newAddr, user_id: user.id, is_default: addresses.length === 0,
    }]).select().single();
    if (!error && data) {
      setAddresses((prev) => [...prev, data]);
      setSelectedAddress(data.id);
      setAddingAddress(false);
      setNewAddr({ label: 'Home', street: '', city: '', pincode: '' });
      toast.success('Address added!');
    }
  };

  const finalTotal = total - (couponData?.discount || 0);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    if (cart.items.length === 0) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      const items = cart.items.map((item) => ({
        id: item.id, name: item.name, price: item.price, qty: item.qty, is_veg: item.is_veg,
      }));
      const order = await placeOrder({
        restaurant_id: cart.restaurantId,
        address_id: selectedAddress,
        items,
        subtotal,
        delivery_fee: deliveryFee,
        tax,
        total: finalTotal,
        coupon_code: couponData?.coupon?.code || null,
      });
      clearCart();
      navigate('/order-success', { state: { order } });
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (totalItems === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar variant="home" />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Browse restaurants and add your favourite items!</p>
          <button onClick={() => navigate('/home')} className="btn-primary px-8 py-3">Browse Restaurants</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="home" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Your Cart</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — Cart Items + Address */}
          <div className="lg:col-span-2 space-y-5">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-900">{cart.restaurantName}</h2>
                  <p className="text-xs text-gray-500">{totalItems} items</p>
                </div>
              </div>
              <div>{cart.items.map((item) => <CartItem key={item.id} item={item} />)}</div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-primary" /> Delivery Address
              </h2>
              <div className="space-y-2 mb-4">
                {addresses.map((addr) => (
                  <label key={addr.id} className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAddress === addr.id ? 'border-primary bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-1 accent-primary"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">{addr.label}</span>
                        {addr.is_default && <span className="text-xs text-primary font-semibold">Default</span>}
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">{addr.street}, {addr.city} - {addr.pincode}</p>
                    </div>
                  </label>
                ))}
              </div>

              {addingAddress ? (
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Label</label>
                      <select className="input-field text-sm py-2" value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}>
                        {['Home', 'Work', 'Other'].map((l) => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Pincode</label>
                      <input className="input-field text-sm py-2" placeholder="560001" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Street Address</label>
                    <input className="input-field text-sm py-2" placeholder="123 Main St, Area" value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">City</label>
                    <input className="input-field text-sm py-2" placeholder="Bangalore" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddAddress} className="btn-primary flex-1 py-2 text-sm">Save Address</button>
                    <button onClick={() => setAddingAddress(false)} className="btn-ghost flex-1 py-2 text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingAddress(true)} className="flex items-center gap-2 text-primary text-sm font-semibold hover:underline">
                  <Plus size={15} /> Add new address
                </button>
              )}
            </div>
          </div>

          {/* Right — Bill Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Tag size={16} className="text-primary" /> Apply Coupon
              </h3>
              <div className="flex gap-2">
                <input
                  className="input-field flex-1 text-sm py-2.5 uppercase"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); setCouponData(null); }}
                />
                <button onClick={handleCoupon} className="btn-outline text-sm px-4 py-2.5">Apply</button>
              </div>
              {couponError && (
                <div className="flex items-center gap-1.5 text-red-500 text-xs mt-2">
                  <AlertCircle size={13} /> {couponError}
                </div>
              )}
              {couponData && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mt-2 bg-green-50 rounded-lg p-2.5">
                  <Tag size={14} /> ₹{couponData.discount} discount applied!
                </div>
              )}
              {/* Quick Coupons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {['SAVE50', 'FIRST100', 'FLAT20'].map((code) => (
                  <button key={code} onClick={() => { setCouponCode(code); setCouponError(''); setCouponData(null); }}
                    className="text-xs bg-orange-50 border border-orange-100 text-primary font-semibold px-2.5 py-1 rounded-lg hover:bg-primary hover:text-white transition-colors">
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Details */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-bold text-gray-900 mb-4">Bill Details</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span><span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-xs text-green-600 -mt-1">Free delivery on orders above ₹299</p>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>GST & Charges (5%)</span><span>₹{tax}</span>
                </div>
                {couponData && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Coupon Discount</span><span>-₹{couponData.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base pt-3 border-t">
                  <span>To Pay</span><span>₹{finalTotal}</span>
                </div>
              </div>
            </div>

            <button
              id="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn-primary w-full py-4 text-base flex items-center justify-between px-6 rounded-2xl"
            >
              <span>Place Order</span>
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <ChevronRight size={20} />}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By placing your order, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
