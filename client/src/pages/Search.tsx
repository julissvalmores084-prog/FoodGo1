import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search as SearchIcon, MapPin, Clock, DollarSign, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Search() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  const { data: restaurants } = trpc.restaurants.list.useQuery(undefined);
  // For search, we'll use a simpler approach - just search restaurants
  // Food items search can be added later with a dedicated endpoint
  const foodItems: any[] = [];

  // Get unique categories
  const categories = useMemo(() => {
    if (!restaurants) return [];
    return Array.from(new Set(restaurants.map((r: any) => r.category))).filter(Boolean);
  }, [restaurants]);

  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    if (!restaurants) return [];
      return (restaurants ?? []).filter((restaurant: any) => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (restaurant.description?.toLowerCase() ?? "").includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || restaurant.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [restaurants, searchQuery, selectedCategory]);

  // Filter food items
  const filteredFoodItems = useMemo(() => {
    if (!foodItems) return [];
      return (foodItems ?? []).filter((item: any) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    });
  }, [foodItems, searchQuery, priceRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Search</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search restaurants, food, or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-lg"
            />
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-32 space-y-6">
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === null
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category: any) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category as string)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === category
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category as string}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">Price Range</h3>
                {/* Price filter disabled for now */}
              </div>

              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setPriceRange([0, 100000]);
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-8">
            {/* Restaurants Results */}
            {filteredRestaurants.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Restaurants ({filteredRestaurants.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRestaurants.map((restaurant: any) => (
                    <Card
                      key={restaurant.id}
                      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                      className="p-4 cursor-pointer hover:shadow-lg transition"
                    >
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600">{restaurant.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">
                            {restaurant.category}
                          </span>
                          {restaurant.deliveryTime && (
                            <span className="flex items-center gap-1 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              {restaurant.deliveryTime} min
                            </span>
                          )}
                          {restaurant.deliveryFee && (
                            <span className="flex items-center gap-1 text-xs text-gray-600">
                              <DollarSign className="w-3 h-3" />
                              ₱{(restaurant.deliveryFee / 100).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Food Items Results - Coming Soon */}

            {/* No Results */}
            {filteredRestaurants.length === 0 && (
              <Card className="p-12 text-center">
                <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setPriceRange([0, 100000]);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Clear All Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
