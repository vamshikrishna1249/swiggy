import { useState, useEffect } from 'react';
import { Camera, Edit2, MapPin, Plus, Trash2, LogOut, Package, Check, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { fetchUserOrders } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  placed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-yellow-100 text-yellow-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Profile = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm({ name: profile.name || '', phone: profile.phone || '' });
  }, [profile]);

  useEffect(() => {
    if (activeTab === 'addresses') loadAddresses();
    if (activeTab === 'orders') loadOrders();
  }, [activeTab]);

  const loadAddresses = async () => {
    if (!user?.id || user.id.startsWith('demo-')) { setAddresses([]); return; }
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id);
    setAddresses(data || []);
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      if (user?.id?.startsWith('demo-')) { setOrders([]); return; }
      const data = await fetchUserOrders();
      setOrders(data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoadingOrders(false); }
  };

  const handleSaveProfile = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      await updateProfile({ name: form.name, phone: form.phone });
      setEditing(false);
      toast.success('Profile updated!');
    } catch (e) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    await supabase.from('addresses').delete().eq('id', id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success('Address removed');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const TAB_ITEMS = [
    { key: 'profile', label: '👤 Profile' },
    { key: 'addresses', label: '📍 Addresses' },
    { key: 'orders', label: '📦 Orders' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="home" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6 text-center mb-4">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-black mx-auto">
                  {profile?.name?.[0]?.toUpperCase() || '?'}
                </div>
              </div>
              <h2 className="font-bold text-gray-900">{profile?.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{profile?.email}</p>
              {profile?.role === 'admin' && (
                <span className="inline-block mt-2 text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full">Admin</span>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {TAB_ITEMS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-4 py-3.5 text-sm font-semibold transition-colors ${
                    activeTab === tab.key ? 'bg-orange-50 text-primary border-l-4 border-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div className="border-t border-gray-100" />
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3.5 text-sm font-semibold text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline">
                      <Edit2 size={14} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(false); setForm({ name: profile?.name || '', phone: profile?.phone || '' }); }}
                        className="text-gray-500 text-sm hover:text-gray-700 flex items-center gap-1">
                        <X size={14} /> Cancel
                      </button>
                      <button onClick={handleSaveProfile} disabled={saving}
                        className="btn-primary text-sm py-1.5 px-4 flex items-center gap-1.5">
                        {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Check size={14} /> Save</>}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text' },
                    { label: 'Phone Number', key: 'phone', type: 'tel' },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
                      {editing ? (
                        <input
                          type={type}
                          className="input-field"
                          value={form[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        />
                      ) : (
                        <p className="font-semibold text-gray-900">{profile?.[key] || '—'}</p>
                      )}
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                    <p className="font-semibold text-gray-900">{profile?.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Account Type</label>
                    <span className={`badge ${profile?.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                      {profile?.role || 'user'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
                </div>
                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No saved addresses yet</p>
                    <p className="text-xs text-gray-400 mt-1">Add addresses from the cart page</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:border-orange-200 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin size={16} className="text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">{addr.label}</span>
                              {addr.is_default && <span className="text-xs text-primary font-semibold">Default</span>}
                            </div>
                            <p className="text-sm text-gray-700">{addr.street}</p>
                            <p className="text-xs text-gray-500">{addr.city} - {addr.pincode}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Order History</h2>
                {loadingOrders ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders yet</p>
                    <button onClick={() => navigate('/home')} className="btn-primary mt-4 text-sm py-2 px-6">Order Now</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{order.restaurants?.name}</p>
                            <p className="text-xs text-gray-400 font-mono">#{order.id?.slice(0, 8).toUpperCase()}</p>
                          </div>
                          <div className="text-right">
                            <span className={`badge text-xs ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                              {order.status?.replace('_', ' ')}
                            </span>
                            <p className="text-sm font-bold text-gray-900 mt-1">₹{order.total}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })} • {(order.items || []).length} items
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
