import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Banknote, Search, ChevronRight, ShoppingCart, X, Leaf } from 'lucide-react';
import Navbar from '../components/Navbar';
import MenuItem from '../components/MenuItem';
import { fetchRestaurantById, fetchRestaurantMenu } from '../services/api';
import { useCart } from '../context/CartContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, totalItems, subtotal, deliveryFee, tax, total } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [showCart, setShowCart] = useState(false);
  const categoryRefs = useRef({});

  useEffect(() => {
    const load = async () => {
      try {
        const [r, m] = await Promise.all([fetchRestaurantById(id), fetchRestaurantMenu(id)]);
        setRestaurant(r);
        setMenu(m);
        if (m.length > 0) setActiveCategory(m[0].id);
      } catch (e) {
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const scrollToCategory = (catId) => {
    setActiveCategory(catId);
    categoryRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filteredMenu = menu.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(menuSearch.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0 || !menuSearch);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar variant="home" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="skeleton h-64 rounded-2xl mb-6" />
          <div className="grid grid-cols-3 gap-4">
            <div className="skeleton h-96 rounded-2xl col-span-1" />
            <div className="skeleton h-96 rounded-2xl col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="home" />

      {/* Restaurant Header Banner */}
      <div className="relative h-56 md:h-72 overflow-hidden bg-gray-200">
        <img
          src={restaurant.banner_url || restaurant.image_url || `https://picsum.photos/seed/${id}banner/1400/400`}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {restaurant.is_pure_veg && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
            <Leaf size={12} /> Pure Veg Restaurant
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black text-white mb-1">{restaurant.name}</h1>
            <p className="text-orange-200 text-sm">
              {Array.isArray(restaurant.cuisine_types) ? restaurant.cuisine_types.join(' · ') : restaurant.cuisine_types}
            </p>
          </div>
        </div>
      </div>

      {/* Restaurant Info Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className={`flex items-center gap-2 font-bold text-lg ${
              restaurant.rating >= 4 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              <Star size={18} fill="currentColor" />
              {restaurant.rating?.toFixed(1)}
              <span className="text-xs text-gray-500 font-normal">(2.1K+ ratings)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} className="text-primary" />
              <span>{restaurant.delivery_time_min} mins delivery</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Banknote size={16} className="text-primary" />
              <span>₹{restaurant.cost_for_two} for two</span>
            </div>
            {restaurant.discount && (
              <div className="ml-auto bg-primary/10 text-primary font-bold text-xs px-3 py-1.5 rounded-lg">
                🎉 {restaurant.discount}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 relative">
          {/* Category Sidebar */}
          <div className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Menu</p>
              </div>
              <nav className="p-2 max-h-[70vh] overflow-y-auto scroll-hide">
                {menu.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                      activeCategory === cat.id
                        ? 'bg-orange-50 text-primary font-bold border-l-2 border-primary'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="line-clamp-1">{cat.name}</span>
                    <span className="text-xs text-gray-400 ml-1">({cat.items.length})</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Menu Content */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="bg-white rounded-2xl shadow-card p-3 mb-5 flex items-center gap-3">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search in menu..."
                className="flex-1 text-sm outline-none"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
              />
              {menuSearch && (
                <button onClick={() => setMenuSearch('')} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Menu Sections */}
            {filteredMenu.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-card">
                <div className="text-5xl mb-3">🔍</div>
                <p className="font-bold text-gray-700">No items found for "{menuSearch}"</p>
              </div>
            ) : (
              filteredMenu.map((category) => (
                <div
                  key={category.id}
                  ref={(el) => { categoryRefs.current[category.id] = el; }}
                  className="bg-white rounded-2xl shadow-card p-6 mb-4"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    {category.name}
                    <span className="text-sm text-gray-400 font-normal ml-2">({category.items.length})</span>
                  </h2>
                  <div className="mt-4">
                    {category.items.map((item) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        restaurantId={restaurant.id}
                        restaurantName={restaurant.name}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Floating Cart Panel */}
          {totalItems > 0 && (
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                <div className="bg-primary text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={18} />
                    <span className="font-bold">{totalItems} items</span>
                  </div>
                  <span className="font-bold">₹{subtotal}</span>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-1">From</p>
                  <p className="font-bold text-gray-900 mb-4">{cart.restaurantName}</p>
                  
                  <div className="space-y-1.5 text-sm border-t pt-3 mb-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span><span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>GST (5%)</span><span>₹{tax}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                      <span>Total</span><span>₹{total}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/cart')}
                    className="btn-primary w-full flex items-center justify-between py-3"
                  >
                    <span>View Cart</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cart Bar */}
      {totalItems > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-2xl z-40">
          <button
            onClick={() => navigate('/cart')}
            className="btn-primary w-full flex items-center justify-between py-3.5"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 rounded-lg px-2 py-0.5 text-sm font-bold">{totalItems}</span>
              <span>View Cart</span>
            </div>
            <span>₹{total}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
