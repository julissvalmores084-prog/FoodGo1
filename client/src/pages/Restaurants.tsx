import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Clock, DollarSign, Star, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import type { Restaurant } from "../../../drizzle/schema";
import AnimatedContent from "@/components/AnimatedContent";

export default function Restaurants() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  // Fetch all restaurants
  const { data: restaurants, isLoading, error } = trpc.restaurants.list.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-gray-900">
            Please Login First
          </h1>
          <p className="text-lg text-gray-600">
            You need to be logged in to browse restaurants and place orders.
          </p>
          <Button
            onClick={() => (window.location.href = "/api/oauth/login")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
          >
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-semibold">Error loading restaurants</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Restaurants
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome, {user?.name}! Choose your favorite restaurant.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              My Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {restaurants && restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant: Restaurant) => (
              <AnimatedContent key={restaurant.id}>
              <Card
                key={restaurant.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                {/* Restaurant Image */}
                {restaurant.image && (
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    {restaurant.promo && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {restaurant.promo}
                      </div>
                    )}
                  </div>
                )}

                {/* Restaurant Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {restaurant.description}
                    </p>
                  </div>

                  {/* Category Badge */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {restaurant.category}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">
                        {restaurant.rating || 0}
                      </span>
                    </div>
                    {restaurant.deliveryTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.deliveryTime} min</span>
                      </div>
                    )}
                    {restaurant.deliveryFee !== null && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>₱{(restaurant.deliveryFee / 100).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* View Menu Button */}
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/restaurant/${restaurant.id}`);
                    }}
                  >
                    View Menu
                  </Button>
                </div>
              </Card>
              </AnimatedContent>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No restaurants available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
