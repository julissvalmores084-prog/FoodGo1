import { useAuth } from "@/_core/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AnimatedContent from "@/components/AnimatedContent";

export default function Checkout() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { items: cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash" | "stripe">("cash");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  const createOrderMutation = trpc.orders.create.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-gray-900">Please Login First</h1>
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center space-y-4">
          <p className="text-gray-600 text-lg">Your cart is empty</p>
          <Button
            onClick={() => navigate("/restaurants")}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!/^\+?[0-9\s\-()]{7,}$/.test(formData.phone)) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your delivery address");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const restaurantId = cartItems[0]?.restaurantId;
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const deliveryFee = 5000;
      const totalAmount = subtotal + deliveryFee;

      const result = await createOrderMutation.mutateAsync({
        restaurantId,
        items: cartItems.map(item => ({
          foodItemId: item.foodItemId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
        deliveryFee,
        subtotal,
        paymentMethod,
        deliveryAddress: `${formData.address}, ${formData.city}`,
      });

      toast.success("Order placed successfully!");
      clearCart();

      // Redirect to order tracking
      setTimeout(() => {
        navigate(`/order/${result.orderNumber}`);
      }, 1500);
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 5000;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <AnimatedContent className="lg:col-span-2">
            <Card className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Delivery Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Delivery Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+63 9XX XXX XXXX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Include country code (e.g., +63 for Philippines)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your complete delivery address"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    {[
                      { value: "cash", label: "💵 Cash on Delivery", desc: "Pay when your order arrives" },
                      { value: "gcash", label: "📱 GCash", desc: "Pay via GCash app" },
                      { value: "stripe", label: "💳 Credit/Debit Card", desc: "Pay with Stripe" },
                    ].map(method => (
                      <label
                        key={method.value}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                          paymentMethod === method.value
                            ? "border-orange-600 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={e => setPaymentMethod(e.target.value as any)}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{method.label}</p>
                          <p className="text-sm text-gray-600">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 w-5 h-5" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </form>
               </Card>
          </AnimatedContent>

          {/* Order Summary */}
          <AnimatedContent className="lg:col-span-1" reverse={true}>
            <Card className="p-6 sticky top-24 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto border-b pb-4">
                {cartItems.map(item => (
                  <div key={item.foodItemId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₱{((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
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

              <div className="border-t pt-4 flex justify-between text-lg">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-orange-600">
                  ₱{(total / 100).toFixed(2)}
                </span>
              </div>
            </Card>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
}
