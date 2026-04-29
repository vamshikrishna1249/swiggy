import { Link } from 'react-router-dom';
import { Search, MapPin, ChevronRight, Star, Clock, Shield, Smartphone, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const CUISINES = [
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Biryani', emoji: '🍛' },
  { name: 'Burger', emoji: '🍔' },
  { name: 'Chinese', emoji: '🍜' },
  { name: 'Sushi', emoji: '🍱' },
  { name: 'Desserts', emoji: '🍰' },
  { name: 'North Indian', emoji: '🫓' },
  { name: 'South Indian', emoji: '🫙' },
  { name: 'Rolls', emoji: '🌯' },
  { name: 'Salads', emoji: '🥗' },
  { name: 'Pasta', emoji: '🍝' },
  { name: 'Momos', emoji: '🥟' },
];

const FEATURED = [
  { id: '1', name: 'Domino\'s Pizza', cuisine: 'Pizza, Pasta', rating: 4.2, time: 25, img: 'https://picsum.photos/seed/dominos/400/240', discount: '50% off up to ₹100' },
  { id: '2', name: 'Behrouz Biryani', cuisine: 'Biryani, Mughlai', rating: 4.5, time: 35, img: 'https://picsum.photos/seed/biryani/400/240', discount: '₹125 off' },
  { id: '3', name: 'McDonald\'s', cuisine: 'Burger, Fast Food', rating: 4.1, time: 20, img: 'https://picsum.photos/seed/mcd/400/240' },
  { id: '4', name: 'KFC', cuisine: 'Chicken, Fast Food', rating: 4.0, time: 28, img: 'https://picsum.photos/seed/kfc/400/240', discount: '20% off' },
  { id: '5', name: 'Box8', cuisine: 'North Indian, Chinese', rating: 4.3, time: 30, img: 'https://picsum.photos/seed/box8/400/240' },
];

const HOW_IT_WORKS = [
  { icon: '🔍', step: '01', title: 'Search & Discover', desc: 'Browse thousands of restaurants in your area. Filter by cuisine, rating, delivery time, and more.' },
  { icon: '🛒', step: '02', title: 'Select & Customize', desc: 'Add your favourite dishes to the cart, apply coupon codes, and choose your delivery address.' },
  { icon: '🚀', step: '03', title: 'Fast Delivery', desc: 'Our delivery partners ensure your hot, fresh meal reaches your door in 30 minutes or less.' },
];

const Landing = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="min-h-screen">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-xl font-black text-gray-900">swiggy<span className="text-primary">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#how" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">How it Works</a>
            <a href="#cuisines" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Cuisines</a>
            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">Sign In</Link>
            <Link to="/signup" className="btn-primary text-sm py-2">Order Now</Link>
          </div>
          <div className="md:hidden flex gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600">Login</Link>
            <Link to="/signup" className="btn-primary text-sm py-1.5 px-4">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-orange-100 rounded-full px-4 py-1.5 text-sm text-primary font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Delivering to 500+ cities across India
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
              Order food to your{' '}
              <span className="text-primary relative">
                door
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 10" fill="none">
                  <path d="M0 5 Q100 0 200 5" stroke="#FC8019" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{' '}
              in minutes
            </h1>

            <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
              Discover the best food & drinks in your area from 5,000+ restaurant partners. 
              Fast, fresh and at your fingertips.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex bg-white rounded-2xl shadow-xl border border-gray-100 p-2 max-w-xl mx-auto">
              <div className="flex items-center gap-2 px-3 flex-1 border-r border-gray-100">
                <MapPin size={18} className="text-primary flex-shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your delivery location"
                  className="flex-1 text-sm outline-none placeholder:text-gray-400"
                />
              </div>
              <button type="submit" className="btn-primary text-sm py-3 px-5 ml-1 rounded-xl flex items-center gap-2">
                <Search size={16} /> Find Food
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-4">
              New to Swiggy?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">Create account for free →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">Three simple steps to your favourite meal</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative text-center group">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[40%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-2xl text-4xl mb-5 group-hover:scale-110 transition-transform duration-300 border border-orange-100">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-primary tracking-wide mb-2">STEP {step.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cuisine Categories */}
      <section id="cuisines" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">What's on your mind?</h2>
            <p className="text-gray-500">Choose your favourite cuisine and we'll find the best spots</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {CUISINES.map((c) => (
              <Link
                key={c.name}
                to="/signup"
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-card 
                           hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
              >
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                  {c.emoji}
                </span>
                <span className="text-xs font-semibold text-gray-700 text-center">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Restaurant Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-1">Top picks for you</h2>
              <p className="text-gray-500">Discover our most loved restaurants</p>
            </div>
            <Link to="/signup" className="flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all">
              See all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex gap-5 overflow-x-auto scroll-hide pb-2">
            {FEATURED.map((r) => (
              <Link
                key={r.id}
                to="/signup"
                className="flex-shrink-0 w-64 card group cursor-pointer"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {r.discount && (
                    <div className="absolute bottom-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg">
                      {r.discount}
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">{r.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{r.cuisine}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <Star size={11} fill="currentColor" /> {r.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {r.time} mins
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Clock size={28} />, title: '30-min Delivery', desc: 'Hot meals delivered to your door in under 30 minutes, every time.' },
              { icon: <Shield size={28} />, title: 'Safe & Hygienic', desc: 'All restaurant partners follow strict food safety and hygiene standards.' },
              { icon: <Star size={28} />, title: '5,000+ Restaurants', desc: 'Choose from thousands of top-rated restaurants in your city.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-card">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Banner */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Smartphone size={22} className="text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Get the App</h2>
              </div>
              <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
                Download the Swiggy app for faster ordering, real-time tracking, 
                exclusive app-only deals and a seamless food delivery experience.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                {['App Store', 'Google Play'].map((s) => (
                  <a key={s} href="#"
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 
                               rounded-xl px-5 py-3 transition-all group">
                    <span className="text-2xl">{s === 'App Store' ? '🍎' : '🤖'}</span>
                    <div className="text-left">
                      <p className="text-xs text-gray-400">Download on</p>
                      <p className="text-sm font-bold text-white">{s}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex gap-6 items-center">
              {[
                { value: '500+', label: 'Cities' },
                { value: '5K+', label: 'Restaurants' },
                { value: '10M+', label: 'Happy Users' },
                { value: '4.8', label: 'App Rating' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary mb-1">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
