import { useAuth } from "@/_core/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import type { FoodItem } from "../../../drizzle/schema";
import AnimatedContent from "@/components/AnimatedContent";

export default function RestaurantDetail({ params }: { params: { id: string } }) {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { items: cartItems, addItem, updateQuantity } = useCart();
  const restaurantId = parseInt(params.id);
  const [localQuantities, setLocalQuantities] = useState<{ [key: number]: number }>({});

  const { data: restaurant, isLoading: restaurantLoading } = trpc.restaurants.get.useQuery({
    id: restaurantId,
  });

  const { data: foodItems, isLoading: itemsLoading } = trpc.foodItems.listByRestaurant.useQuery({
    restaurantId,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-gray-900">Please Login First</h1>
          <p className="text-lg text-gray-600">
            You need to be logged in to view restaurant details and order food.
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

  if (restaurantLoading || itemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-semibold">Restaurant not found</p>
          <Button
            onClick={() => navigate("/restaurants")}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Back to Restaurants
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (item: FoodItem) => {
    const quantity = localQuantities[item.id] || 1;
    addItem({
      foodItemId: item.id,
      restaurantId: restaurantId,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image || undefined,
    });
    toast.success(`${item.name} added to cart!`);
    setLocalQuantities(prev => ({ ...prev, [item.id]: 0 }));
  };

  const handleQuantityChange = (foodItemId: number, delta: number) => {
    const current = localQuantities[foodItemId] || 0;
    const newQuantity = Math.max(0, current + delta);
    setLocalQuantities(prev => ({
      ...prev,
      [foodItemId]: newQuantity,
    }));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/restaurants")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
          <Button
            onClick={() => navigate("/cart")}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart ({cartCount})
          </Button>
        </div>
      </div>

      {/* Restaurant Hero */}
      <AnimatedContent className="container max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          {restaurant.image && (
            <div className="h-64 bg-gray-200 overflow-hidden">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{restaurant.name}</h2>
              <p className="text-gray-600 mt-2">{restaurant.description}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-semibold">
                {restaurant.category}
              </span>
              {restaurant.deliveryTime && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  ⏱️ {restaurant.deliveryTime} min
                </span>
              )}
              {restaurant.deliveryFee !== null && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  💵 ₱{(restaurant.deliveryFee / 100).toFixed(2)} delivery
                </span>
              )}
              {restaurant.promo && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                  🎉 {restaurant.promo}
                </span>
              )}
            </div>
          </div>
        </div>
      </AnimatedContent>

      {/* Menu Items */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Menu</h3>
        {foodItems && foodItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodItems.map((item: FoodItem) => {
              const quantity = localQuantities[item.id] || 0;
              return (
                <AnimatedContent key={item.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  {item.image && (
                    <div className="h-40 bg-gray-200 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                    </div>
                    {item.category && (
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {item.category}
                      </span>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="font-bold text-lg text-orange-600">
                        ₱{(item.price / 100).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        {quantity > 0 ? (
                          <>
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold w-6 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <Button
                              onClick={() => handleAddToCart(item)}
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                              Add
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => {
                              setLocalQuantities(prev => ({
                                ...prev,
                                [item.id]: 1,
                              }));
                            }}
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600"
                          >
                            Select
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
                </AnimatedContent>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No menu items available.</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => navigate("/cart")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-lg"
          >
            <ShoppingCart className="w-6 h-6" />
            View Cart ({cartCount})
          </Button>
        </div>
      )}
    </div>
  );
}
