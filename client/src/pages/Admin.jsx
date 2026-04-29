import { useState, useEffect } from 'react';
import { ShoppingBag, Store, DollarSign, Users, Plus, Edit2, Trash2, X, Check, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import {
  fetchAdminStats, fetchAllOrders, updateOrderStatus,
  fetchAllRestaurantsAdmin, deleteRestaurant, createRestaurant, updateRestaurant,
  fetchAdminMenuItems, createMenuItem, updateMenuItem, deleteMenuItem,
} from '../services/api';
import { FAKE_RESTAURANTS, FAKE_ORDERS, FAKE_STATS, FAKE_MENU_ITEMS } from '../services/fakeData';
import { toast } from 'react-toastify';

const STATUS_COLORS = {
  placed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-yellow-100 text-yellow-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUSES = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const MetricCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

const Admin = () => {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [loading, setLoading] = useState(false);
  const [restSearch, setRestSearch] = useState('');
  const [restPage, setRestPage] = useState(1);
  const REST_PER_PAGE = 12;
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const [restForm, setRestForm] = useState({
    name: '', cuisine_types: '', city: '', rating: 4.0, delivery_time_min: 30,
    min_order: 100, cost_for_two: 400, is_pure_veg: false, discount: '', is_active: true,
    image_url: '', banner_url: '',
  });

  const [menuForm, setMenuForm] = useState({
    name: '', description: '', price: '', is_veg: true, is_available: true,
    image_url: '', restaurant_id: '', category_id: '',
  });

  useEffect(() => {
    if (tab === 'dashboard') loadStats();
    if (tab === 'orders') loadOrders();
    if (tab === 'restaurants') loadRestaurants();
  }, [tab]);

  useEffect(() => {
    if (tab === 'menu' && selectedRestaurantId) loadMenuItems();
  }, [tab, selectedRestaurantId]);

  const loadStats = async () => {
    try {
      const data = await fetchAdminStats();
      if (!data || !data.totalOrders) throw new Error('empty');
      setStats(data);
    } catch {
      setStats(FAKE_STATS);
    }
  };
  const loadOrders = async () => {
    try {
      const data = await fetchAllOrders();
      setOrders(data && data.length ? data : FAKE_ORDERS);
    } catch { setOrders(FAKE_ORDERS); }
  };
  const loadRestaurants = async () => {
    try {
      const data = await fetchAllRestaurantsAdmin();
      setRestaurants(data && data.length ? data : FAKE_RESTAURANTS);
    } catch { setRestaurants(FAKE_RESTAURANTS); }
  };
  const loadMenuItems = async () => {
    try {
      const data = await fetchAdminMenuItems(selectedRestaurantId);
      const fallback = FAKE_MENU_ITEMS[selectedRestaurantId] || [];
      setMenuItems(data && data.length ? data : fallback);
    } catch { setMenuItems(FAKE_MENU_ITEMS[selectedRestaurantId] || []); }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      toast.success('Status updated!');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const openRestaurantModal = (r = null) => {
    setEditingRestaurant(r);
    setRestForm(r ? {
      ...r,
      cuisine_types: Array.isArray(r.cuisine_types) ? r.cuisine_types.join(', ') : r.cuisine_types,
    } : {
      name: '', cuisine_types: '', city: '', rating: 4.0, delivery_time_min: 30,
      min_order: 100, cost_for_two: 400, is_pure_veg: false, discount: '', is_active: true, image_url: '', banner_url: '',
    });
    setShowRestaurantModal(true);
  };

  const handleSaveRestaurant = async () => {
    const payload = {
      ...restForm,
      cuisine_types: restForm.cuisine_types.split(',').map((s) => s.trim()).filter(Boolean),
      rating: parseFloat(restForm.rating),
      delivery_time_min: parseInt(restForm.delivery_time_min),
      min_order: parseInt(restForm.min_order),
      cost_for_two: parseInt(restForm.cost_for_two),
    };
    try {
      if (editingRestaurant) {
        await updateRestaurant(editingRestaurant.id, payload);
        toast.success('Restaurant updated!');
      } else {
        await createRestaurant(payload);
        toast.success('Restaurant created!');
      }
      setShowRestaurantModal(false);
      loadRestaurants();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm('Delete this restaurant?')) return;
    try {
      await deleteRestaurant(id);
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
      toast.success('Restaurant deleted');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleSaveMenuItem = async () => {
    const payload = { ...menuForm, price: parseFloat(menuForm.price), restaurant_id: selectedRestaurantId };
    try {
      if (editingMenuItem) {
        await updateMenuItem(editingMenuItem.id, payload);
        toast.success('Item updated!');
      } else {
        await createMenuItem(payload);
        toast.success('Item created!');
      }
      setShowMenuModal(false);
      loadMenuItems();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const TABS = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'orders', label: '🛵 Orders' },
    { key: 'restaurants', label: '🏪 Restaurants' },
    { key: 'menu', label: '🍽️ Menu Items' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="home" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Manage your platform</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key ? 'bg-primary text-white shadow-primary' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <MetricCard icon={ShoppingBag} label="Total Orders"   value={(stats.totalOrders || 0).toLocaleString()}                     color="bg-blue-500" />
              <MetricCard icon={DollarSign}  label="Total Revenue"  value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}              color="bg-green-500" />
              <MetricCard icon={Store}       label="Restaurants"    value={(stats.activeRestaurants || 0).toLocaleString()}                color="bg-primary" />
              <MetricCard icon={Users}       label="Total Users"    value={(stats.totalUsers || 0).toLocaleString()}                       color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Recent Orders</h3>
                  <button onClick={() => setTab('orders')} className="text-xs text-primary font-semibold hover:underline">View all →</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {(orders.length ? orders : FAKE_ORDERS).slice(0, 6).map(o => (
                    <div key={o.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{o.profiles?.name || '—'}</p>
                        <p className="text-xs text-gray-400">{o.restaurants?.name || '—'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{o.total}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-500'}`}>{o.status?.replace('_',' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Restaurants */}
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Top Restaurants</h3>
                  <button onClick={() => setTab('restaurants')} className="text-xs text-primary font-semibold hover:underline">View all →</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {(restaurants.length ? restaurants : FAKE_RESTAURANTS)
                    .sort((a,b) => b.rating - a.rating)
                    .slice(0, 6)
                    .map(r => (
                    <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                      <img src={r.image_url || `https://picsum.photos/seed/${r.id}/40/40`} alt={r.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.city} • {r.cuisine_types?.[0]}</p>
                      </div>
                      <span className="text-sm font-bold text-yellow-500">⭐ {r.rating}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Delivered Today', value: '48', icon: '✅', color: 'text-green-600 bg-green-50' },
                { label: 'Pending Orders', value: '12', icon: '⏳', color: 'text-yellow-600 bg-yellow-50' },
                { label: 'Avg Order Value', value: '₹485', icon: '💰', color: 'text-blue-600 bg-blue-50' },
                { label: 'Active Coupons', value: '5', icon: '🎟️', color: 'text-purple-600 bg-purple-50' },
              ].map(s => (
                <div key={s.label} className={`rounded-2xl p-4 ${s.color.split(' ')[1]}`}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <p className={`text-xl font-black ${s.color.split(' ')[0]}`}>{s.value}</p>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">All Orders ({orders.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID', 'Customer', 'Restaurant', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">#{order.id?.slice(0, 8).toUpperCase()}</td>
                      <td className="px-4 py-3">{order.profiles?.name || '—'}</td>
                      <td className="px-4 py-3 font-medium">{order.restaurants?.name || '—'}</td>
                      <td className="px-4 py-3 font-bold">₹{order.total}</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Restaurants */}
        {tab === 'restaurants' && (
          <div>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <h2 className="font-bold text-gray-900">Restaurants ({restaurants.length})</h2>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Search restaurants…"
                  value={restSearch}
                  onChange={(e) => { setRestSearch(e.target.value); setRestPage(1); }}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none w-52"
                />
                <button onClick={() => openRestaurantModal()} className="btn-primary text-sm py-2 flex items-center gap-2">
                  <Plus size={15} /> Add Restaurant
                </button>
              </div>
            </div>
            {(() => {
              const filtered = restaurants.filter(r =>
                r.name.toLowerCase().includes(restSearch.toLowerCase()) ||
                (r.city || '').toLowerCase().includes(restSearch.toLowerCase())
              );
              const totalPages = Math.ceil(filtered.length / REST_PER_PAGE);
              const paged = filtered.slice((restPage - 1) * REST_PER_PAGE, restPage * REST_PER_PAGE);
              return (
                <>
                  <p className="text-xs text-gray-400 mb-3">Showing {paged.length} of {filtered.length} restaurants</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paged.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <img src={r.image_url || `https://picsum.photos/seed/${r.id}/300/150`} alt={r.name} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{r.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{r.city} • ⭐ {r.rating}</p>
                    <div className="flex items-center justify-between">
                      <span className={`badge text-xs ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {r.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => openRestaurantModal(r)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteRestaurant(r.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6 flex-wrap">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setRestPage(p)}
                          className={`w-8 h-8 rounded-lg text-sm font-semibold ${
                            p === restPage ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary'
                          }`}>{p}</button>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* Menu Items */}
        {tab === 'menu' && (
          <div>
            <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <select
                  value={selectedRestaurantId}
                  onChange={(e) => setSelectedRestaurantId(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                  onClick={() => { if (!restaurants.length) loadRestaurants(); }}
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              {selectedRestaurantId && (
                <button onClick={() => { setEditingMenuItem(null); setMenuForm({ name: '', description: '', price: '', is_veg: true, is_available: true, image_url: '', restaurant_id: selectedRestaurantId, category_id: '' }); setShowMenuModal(true); }}
                  className="btn-primary text-sm py-2 flex items-center gap-2">
                  <Plus size={15} /> Add Item
                </button>
              )}
            </div>
            {selectedRestaurantId && (
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Name', 'Category', 'Price', 'Veg', 'Available', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-gray-500">{item.menu_categories?.name || '—'}</td>
                        <td className="px-4 py-3 font-bold">₹{item.price}</td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${item.is_veg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.is_veg ? 'Veg' : 'Non-Veg'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {item.is_available ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingMenuItem(item); setMenuForm(item); setShowMenuModal(true); }}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                            <button onClick={async () => { if (window.confirm('Delete?')) { await deleteMenuItem(item.id); loadMenuItems(); toast.success('Deleted'); } }}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Restaurant Modal */}
      {showRestaurantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{editingRestaurant ? 'Edit' : 'Add'} Restaurant</h3>
              <button onClick={() => setShowRestaurantModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Name', key: 'name', type: 'text' },
                { label: 'Cuisine Types (comma-separated)', key: 'cuisine_types', type: 'text' },
                { label: 'City', key: 'city', type: 'text' },
                { label: 'Image URL', key: 'image_url', type: 'text' },
                { label: 'Banner URL', key: 'banner_url', type: 'text' },
                { label: 'Discount text (optional)', key: 'discount', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input type={type} className="input-field text-sm py-2" value={restForm[key] || ''} onChange={(e) => setRestForm({ ...restForm, [key]: e.target.value })} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Rating', key: 'rating', step: '0.1', min: '0', max: '5' },
                  { label: 'Delivery (mins)', key: 'delivery_time_min', step: '1' },
                  { label: 'Min Order (₹)', key: 'min_order' },
                  { label: 'Cost for Two (₹)', key: 'cost_for_two' },
                ].map(({ label, key, ...rest }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    <input type="number" className="input-field text-sm py-2" {...rest} value={restForm[key] || ''} onChange={(e) => setRestForm({ ...restForm, [key]: e.target.value })} />
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={restForm.is_pure_veg} onChange={(e) => setRestForm({ ...restForm, is_pure_veg: e.target.checked })} className="accent-green-500" />
                  Pure Veg
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={restForm.is_active} onChange={(e) => setRestForm({ ...restForm, is_active: e.target.checked })} className="accent-primary" />
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setShowRestaurantModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleSaveRestaurant} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Check size={15} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Item Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{editingMenuItem ? 'Edit' : 'Add'} Menu Item</h3>
              <button onClick={() => setShowMenuModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Name', key: 'name' },
                { label: 'Description', key: 'description' },
                { label: 'Image URL', key: 'image_url' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input className="input-field text-sm py-2" value={menuForm[key] || ''} onChange={(e) => setMenuForm({ ...menuForm, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹)</label>
                <input type="number" className="input-field text-sm py-2" value={menuForm.price || ''} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={menuForm.is_veg} onChange={(e) => setMenuForm({ ...menuForm, is_veg: e.target.checked })} className="accent-green-500" />
                  Veg
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={menuForm.is_available} onChange={(e) => setMenuForm({ ...menuForm, is_available: e.target.checked })} className="accent-primary" />
                  Available
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setShowMenuModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleSaveMenuItem} className="btn-primary flex-1"><Check size={15} className="inline mr-1" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
