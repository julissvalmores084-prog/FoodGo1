import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MapPin, Phone, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import AnimatedContent from "@/components/AnimatedContent";

const ORDER_STATUSES = [
  { id: "pending", label: "Order Received", icon: "📋" },
  { id: "confirmed", label: "Confirmed", icon: "✅" },
  { id: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { id: "out_for_delivery", label: "Out for Delivery", icon: "🚗" },
  { id: "delivered", label: "Delivered", icon: "🎉" },
];

interface OrderData {
  orderNumber: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  riderName?: string;
  riderPhone?: string;
  estimatedDelivery?: string;
  createdAt: string;
}

export default function OrderTracking({ params }: { params: { orderNumber: string } }) {
  const [, navigate] = useLocation();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const { data: fetchedOrder, isLoading: loading } = trpc.orders.getByNumber.useQuery(
    { orderNumber: params.orderNumber },
    { enabled: !!params.orderNumber }
  );

  useEffect(() => {
    if (fetchedOrder) {
      const orderData: OrderData = {
        orderNumber: fetchedOrder.orderNumber,
        status: fetchedOrder.status,
        totalAmount: fetchedOrder.totalAmount,
        deliveryAddress: fetchedOrder.deliveryAddress || "Address not provided",
        createdAt: fetchedOrder.createdAt.toISOString(),
      };
      setOrder(orderData);
    }

    // Simulate automatic status updates
    const statusInterval = setInterval(() => {
      setCurrentStatusIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex < ORDER_STATUSES.length) {
          const newStatus = ORDER_STATUSES[nextIndex];
          setOrder(prevOrder =>
            prevOrder
              ? {
                  ...prevOrder,
                  status: newStatus.id,
                  riderName: nextIndex >= 3 ? "John Doe" : undefined,
                  riderPhone: nextIndex >= 3 ? "+63 9XX XXX XXXX" : undefined,
                  estimatedDelivery:
                    nextIndex >= 3
                      ? new Date(Date.now() + 30 * 60000).toLocaleTimeString()
                      : undefined,
                }
              : null
          );
          toast.success(`Order ${newStatus.label}!`);
        }
        return Math.min(nextIndex, ORDER_STATUSES.length - 1);
      });
    }, 8000);

    return () => clearInterval(statusInterval);
  }, [fetchedOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-semibold">Order not found</p>
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

  const currentStatus = ORDER_STATUSES.find(s => s.id === order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
            <p className="text-gray-600 mt-2">Order #{order.orderNumber}</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking */}
          <AnimatedContent className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {currentStatus?.label}
              </h2>

              <div className="space-y-6">
                {ORDER_STATUSES.map((status, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = status.id === order.status;

                  return (
                    <div key={status.id} className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition ${
                          isCompleted
                            ? "bg-orange-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {status.icon}
                      </div>
                      <div className="flex-1 pt-1">
                        <h3
                          className={`font-bold text-lg ${
                            isCurrent ? "text-orange-600" : "text-gray-900"
                          }`}
                        >
                          {status.label}
                        </h3>
                        {isCurrent && (
                          <p className="text-sm text-gray-600 mt-1">
                            Currently at this stage
                          </p>
                        )}
                        {isCompleted && !isCurrent && (
                          <p className="text-sm text-green-600 mt-1">✓ Completed</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Rider Information */}
            {order.riderName && (
              <Card className="p-6 space-y-4 border-2 border-orange-200 bg-orange-50">
                <h3 className="text-xl font-bold text-gray-900">
                  🚗 Your Rider
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Rider Name</p>
                    <p className="font-bold text-lg text-gray-900">
                      {order.riderName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-bold text-lg text-gray-900">
                      {order.riderPhone}
                    </p>
                  </div>
                </div>
                {order.estimatedDelivery && (
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Estimated Arrival</p>
                    <p className="font-bold text-2xl text-orange-600">
                      {order.estimatedDelivery}
                    </p>
                  </div>
                )}
              </Card>
            )}
          </AnimatedContent>

          {/* Order Details Sidebar */}
          <AnimatedContent className="space-y-6" reverse={true}>
            {/* Delivery Address */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Delivery Address
              </h3>
              <p className="text-gray-700">{order.deliveryAddress}</p>
            </Card>

            {/* Order Amount */}
            <Card className="p-6 space-y-4 bg-orange-50 border-2 border-orange-200">
              <h3 className="text-lg font-bold text-gray-900">Order Total</h3>
              <p className="text-4xl font-bold text-orange-600">
                ₱{(order.totalAmount / 100).toFixed(2)}
              </p>
            </Card>

            {/* Estimated Time */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Estimated Time
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {currentStatusIndex >= 4 ? "Delivered" : "30 - 45 mins"}
              </p>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/restaurants")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Order More Food
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
              >
                Back to Home
              </Button>
            </div>

            {/* Info Box */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💡 Tip:</span> Your order will be
                automatically updated as it progresses through each stage.
              </p>
            </Card>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
}
