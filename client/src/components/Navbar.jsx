import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, MapPin, Search, User, ChevronDown, LogOut, Settings, Package, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

const Navbar = ({ variant = 'home' }) => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { address, city, updateLocation } = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationInput, setLocationInput] = useState(city);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await signOut();
    navigate('/', { replace: true });
  };

  const handleLocationSave = () => {
    updateLocation(locationInput, locationInput);
    setLocationOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to={user ? '/home' : '/'} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-xl font-black text-gray-900">
              swiggy<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Location Picker (home variant) */}
          {variant === 'home' && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 
                           hover:text-primary transition-colors border-b-2 border-primary pb-0.5"
              >
                <MapPin size={15} className="text-primary" />
                <span className="max-w-[160px] truncate">{address}</span>
                <ChevronDown size={14} className={`transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
              </button>

              {locationOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-fade-in">
                  <p className="text-xs font-semibold text-gray-500 mb-2">CHANGE LOCATION</p>
                  <input
                    className="input-field mb-3"
                    placeholder="Enter city or area"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2 mb-3">
                    {cities.map((c) => (
                      <button
                        key={c}
                        onClick={() => setLocationInput(c)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          locationInput === c
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 text-gray-600 hover:border-primary'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleLocationSave} className="btn-primary w-full text-sm py-2">
                    Confirm Location
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative flex items-center gap-2 text-sm font-semibold text-gray-700 
                             hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
                >
                  <ShoppingCart size={20} />
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 
                                    rounded-full flex items-center justify-center font-bold animate-bounce-in">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 
                               hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
                  >
                    <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                      {profile?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="max-w-[100px] truncate">{profile?.name || 'Account'}</span>
                    <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-sm text-gray-900">{profile?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary">
                        <Settings size={15} /> My Profile
                      </Link>
                      <Link to="/orders" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary">
                        <Package size={15} /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-orange-50 font-medium">
                          <Settings size={15} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1" />
                      <button onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link text-sm px-4 py-2">Sign In</Link>
                <Link to="/signup" className="btn-primary text-sm py-2">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2 animate-slide-up">
            {user ? (
              <>
                <div className="px-4 py-2 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-sm">{profile?.name}</p>
                  <p className="text-xs text-gray-500">{profile?.email}</p>
                </div>
                <Link to="/cart" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium">
                  <ShoppingCart size={18} /> Cart {totalItems > 0 && <span className="badge bg-primary text-white">{totalItems}</span>}
                </Link>
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium">
                  <User size={18} /> Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-primary">
                    <Settings size={18} /> Admin Panel
                  </Link>
                )}
                <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-500 text-sm font-medium hover:bg-red-50">
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium">Sign In</Link>
                <Link to="/signup" className="block btn-primary text-center text-sm">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
