import { Link } from 'react-router-dom';
import { Star, Clock, ArrowUpRight, Leaf, Flame } from 'lucide-react';

const RestaurantCard = ({ restaurant, skeleton = false }) => {
  if (skeleton) {
    return (
      <div className="card animate-pulse">
        <div className="skeleton h-44 w-full" />
        <div className="p-4 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
          <div className="skeleton h-3 w-full" />
          <div className="h-px bg-gray-100 my-2" />
          <div className="flex gap-3">
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-3 w-16" />
          </div>
        </div>
      </div>
    );
  }

  const {
    id, name, image_url, cuisine_types, rating, delivery_time_min,
    min_order, cost_for_two, is_pure_veg, discount,
  } = restaurant;

  return (
    <Link to={`/restaurant/${id}`} className="card group cursor-pointer block">
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <img
          src={image_url || `https://picsum.photos/seed/${id}/400/200`}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Discount badge */}
        {discount && (
          <div className="absolute bottom-2 left-2 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            {discount}
          </div>
        )}

        {/* Veg badge */}
        {is_pure_veg && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <Leaf size={10} /> Pure Veg
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          <ArrowUpRight size={16} className="text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
        </div>

        <p className="text-xs text-gray-500 mb-2.5 line-clamp-1">
          {Array.isArray(cuisine_types) ? cuisine_types.join(' · ') : cuisine_types}
        </p>

        <div className="h-px bg-gray-100 mb-3" />

        <div className="flex items-center gap-4 text-xs text-gray-600">
          {/* Rating */}
          <span className={`flex items-center gap-1 font-semibold ${
            rating >= 4 ? 'text-green-600' : rating >= 3 ? 'text-yellow-600' : 'text-red-500'
          }`}>
            <Star size={12} fill="currentColor" />
            {rating?.toFixed(1)}
          </span>

          {/* Delivery Time */}
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {delivery_time_min} mins
          </span>

          {/* Cost */}
          <span className="text-gray-500">₹{cost_for_two} for two</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
