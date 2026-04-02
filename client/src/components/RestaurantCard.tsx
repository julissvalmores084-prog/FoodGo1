import { Star, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
    specialties: string[];
  };
  isLoggedIn: boolean;
  onRate: (rating: number) => void;
}

export default function RestaurantCard({ restaurant, isLoggedIn, onRate }: RestaurantCardProps) {
  const handleStarClick = (rating: number) => {
    if (isLoggedIn) {
      onRate(rating);
    }
  };

  return (
    <div className="card-lift group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-300">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-display text-2xl text-gray-900 mb-1">
              {restaurant.name}
            </h3>
            <p className="text-sm text-gray-600 font-body">
              {restaurant.description}
            </p>
          </div>

          {/* Specialties */}
          <div className="mb-6">
            <p className="text-xs font-heading text-gray-500 mb-2 uppercase tracking-wide">
              Specialties
            </p>
            <div className="flex flex-wrap gap-2">
              {restaurant.specialties.map((specialty, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-xs font-heading rounded-full border border-orange-200"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
            <p className="text-xs font-heading text-gray-600 mb-3 uppercase tracking-wide">
              {isLoggedIn ? 'Your Rating' : 'Restaurant Rating'}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    disabled={!isLoggedIn}
                    className={`transition-all duration-200 ${
                      star <= restaurant.rating
                        ? 'star-pop'
                        : ''
                    }`}
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= restaurant.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      } ${
                        isLoggedIn
                          ? 'hover:fill-yellow-300 hover:text-yellow-300 cursor-pointer'
                          : 'cursor-not-allowed'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <span className="font-heading text-lg text-gray-900 ml-2">
                {restaurant.rating > 0 ? `${restaurant.rating}/5` : '0/5'}
              </span>
            </div>
            {!isLoggedIn && (
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-600 font-body">
                <Lock size={14} />
                Login to rate this restaurant
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            className="w-full button-3d bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-heading py-3 rounded-lg"
            disabled={!isLoggedIn}
          >
            {isLoggedIn ? 'Order Now' : 'Login to Order'}
          </Button>
        </div>
      </div>
    </div>
  );
}
