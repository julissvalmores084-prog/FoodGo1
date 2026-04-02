import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, MapPin, Clock, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import BackButton from "@/components/BackButton";
import AnimatedContent from "@/components/AnimatedContent";

export default function OrderHistory() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: orders, isLoading } = trpc.orders.listByUser.useQuery(
    { userId: user?.id || 0 },
    { enabled: isAuthenticated && !!user?.id }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-gray-900">Please Login First</h1>
          <p className="text-lg text-gray-600">
            You need to be logged in to view your order history.
          </p>
          <Button
            onClick={() => (window.location.href = "/login")}
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Received";
      case "confirmed":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "out_for_delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-4xl font-bold text-gray-900">Order History</h1>
        </div>

        {/* Orders List */}
        {!orders || orders.length === 0 ? (
          <AnimatedContent>
          <Card className="p-12 text-center">
            <p className="text-xl text-gray-600 mb-6">No orders yet</p>
            <Button
              onClick={() => navigate("/restaurants")}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
            >
              Start Ordering
            </Button>
          </Card>
          </AnimatedContent>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <AnimatedContent key={order.id}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Side - Order Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {order.deliveryAddress}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Amount & Action */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ₱{(order.totalAmount / 100).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate(`/order/${order.orderNumber}`)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
              </AnimatedContent>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
