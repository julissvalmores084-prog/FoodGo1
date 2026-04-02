import { useAuth } from "@/_core/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import { useLocation } from "wouter";
import AnimatedContent from "@/components/AnimatedContent";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-gray-900">Please Login First</h1>
          <p className="text-lg text-gray-600">
            You need to be logged in to view your cart.
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

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = items.length > 0 ? 5000 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/restaurants")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map(item => (
                  <AnimatedContent key={item.foodItemId}>
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-orange-600 font-semibold mt-1">
                            ₱{(item.price / 100).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.foodItemId, item.quantity - 1)
                              }
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.foodItemId, item.quantity + 1)
                              }
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="font-bold text-lg w-24 text-right">
                            ₱{((item.price * item.quantity) / 100).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.foodItemId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </AnimatedContent>
                ))}
                <Button
                  onClick={handleClearCart}
                  variant="outline"
                  className="w-full text-red-600 border-red-600 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>
            ) : (
              <AnimatedContent>
                <Card className="p-12 text-center">
                  <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
                  <Button
                    onClick={() => navigate("/restaurants")}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Continue Shopping
                  </Button>
                </Card>
              </AnimatedContent>
            )}
          </div>

          {/* Order Summary */}
          <AnimatedContent className="lg:col-span-1">
            <Card className="p-6 sticky top-24 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ₱{(subtotal / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">
                    ₱{(deliveryFee / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-orange-600">
                  ₱{(total / 100).toFixed(2)}
                </span>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                disabled={items.length === 0}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg"
              >
                Proceed to Checkout
              </Button>

              <Button
                onClick={() => navigate("/restaurants")}
                variant="outline"
                className="w-full"
              >
                Continue Shopping
              </Button>

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-2">💡 Tip</p>
                <p>Free delivery on orders above ₱500!</p>
              </div>
            </Card>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
}
