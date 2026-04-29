import { useState, useEffect, useCallback } from 'react';
import { Search, Leaf, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import RestaurantCard from '../components/RestaurantCard';
import { fetchRestaurants } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { FAKE_RESTAURANTS } from '../services/fakeData';

const CUISINES = ['Pizza', 'Biryani', 'Burger', 'Chinese', 'Sushi', 'Desserts', 'North Indian', 'South Indian', 'Rolls', 'Salads', 'Pasta', 'Momos'];
const CUISINE_EMOJIS = { Pizza: '🍕', Biryani: '🍛', Burger: '🍔', Chinese: '🍜', Sushi: '🍱', Desserts: '🍰', 'North Indian': '🫓', 'South Indian': '🫙', Rolls: '🌯', Salads: '🥗', Pasta: '🍝', Momos: '🥟' };

const SORT_OPTIONS = [
  { value: 'rating', label: 'Rating' },
  { value: 'delivery_time', label: 'Fastest Delivery' },
  { value: 'cost_asc', label: 'Cost: Low to High' },
  { value: 'cost_desc', label: 'Cost: High to Low' },
];

const Home = () => {
  const { city, address } = useLocation();
  const [restaurants, setRestaurants] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    veg: false,
    minRating: '',
    cuisine: '',
    sortBy: 'rating',
    search: '',
  });
  const [searchInput, setSearchInput] = useState('');

  const loadRestaurants = useCallback(async (currentPage = 1) => {
    setLoading(true);
    try {
      const params = {
        city,
        page: currentPage,
        limit: 12,
        ...(filters.veg && { veg: true }),
        ...(filters.minRating && { minRating: filters.minRating }),
        ...(filters.cuisine && { cuisine: filters.cuisine }),
        sortBy: filters.sortBy,
      };
      const data = await fetchRestaurants(params);
      const list = data.restaurants || [];
      if (list.length === 0) throw new Error('empty');
      setRestaurants(list);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
      // Fallback: filter & paginate fake data locally
      let list = [...FAKE_RESTAURANTS];
      if (filters.veg) list = list.filter(r => r.is_pure_veg);
      if (filters.minRating) list = list.filter(r => r.rating >= parseFloat(filters.minRating));
      if (filters.cuisine) list = list.filter(r => r.cuisine_types.some(c => c.toLowerCase().includes(filters.cuisine.toLowerCase())));
      if (filters.sortBy === 'rating') list.sort((a,b) => b.rating - a.rating);
      else if (filters.sortBy === 'delivery_time') list.sort((a,b) => a.delivery_time_min - b.delivery_time_min);
      else if (filters.sortBy === 'cost_asc') list.sort((a,b) => a.cost_for_two - b.cost_for_two);
      else if (filters.sortBy === 'cost_desc') list.sort((a,b) => b.cost_for_two - a.cost_for_two);
      const PAGE_SIZE = 12;
      const total = list.length;
      const paged = list.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE);
      setRestaurants(paged);
      setTotalPages(Math.ceil(total/PAGE_SIZE));
      setTotal(total);
    } finally {
      setLoading(false);
    }
  }, [city, filters]);

  useEffect(() => {
    setPage(1);
    loadRestaurants(1);
  }, [city, filters]);

  useEffect(() => {
    loadRestaurants(page);
  }, [page]);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ veg: false, minRating: '', cuisine: '', sortBy: 'rating', search: '' });
    setSearchInput('');
    setPage(1);
  };

  const hasActiveFilters = filters.veg || filters.minRating || filters.cuisine;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="home" />

      {/* Location Banner */}
      <div className="bg-primary text-white py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-sm font-medium">
          <span className="text-orange-200">📍 Delivering to:</span>
          <span className="font-bold">{address}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* "What's on your mind" */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What's on your mind?</h2>
          <div className="flex gap-4 overflow-x-auto scroll-hide pb-1">
            {CUISINES.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setFilter('cuisine', filters.cuisine === cuisine ? '' : cuisine)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all duration-200 ${
                  filters.cuisine === cuisine
                    ? 'border-primary bg-orange-50 shadow-primary/20 shadow-md'
                    : 'border-transparent bg-white shadow-card hover:border-orange-200'
                }`}
              >
                <span className="text-2xl">{CUISINE_EMOJIS[cuisine]}</span>
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{cuisine}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-[200px] max-w-xs">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search restaurants..."
              className="text-sm outline-none w-full bg-transparent"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Veg Toggle */}
          <button
            onClick={() => setFilter('veg', !filters.veg)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
              filters.veg ? 'bg-green-500 text-white border-green-500' : 'bg-white border-gray-200 text-gray-600 hover:border-green-300'
            }`}
          >
            <Leaf size={14} /> Pure Veg
          </button>

          {/* Rating Filter */}
          <button
            onClick={() => setFilter('minRating', filters.minRating === '4.0' ? '' : '4.0')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
              filters.minRating ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-600 hover:border-primary/50'
            }`}
          >
            <Star size={14} /> 4.0+
          </button>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value)}
            className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 bg-white outline-none cursor-pointer hover:border-primary/50 transition-colors"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-red-500 font-semibold hover:text-red-600 px-3 py-2">
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">
              {filters.cuisine ? `${filters.cuisine} Restaurants` : 'All Restaurants'}
            </h2>
            {!loading && (
              <p className="section-subtitle">{total} restaurants found in {city}</p>
            )}
          </div>
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <RestaurantCard key={i} skeleton />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or change your location</p>
            <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                  p === page ? 'bg-primary text-white shadow-primary' : 'border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
