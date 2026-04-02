import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, MapPin, History, User } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AnimatedContent from "@/components/AnimatedContent";

export default function UserDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const { data: userOrders = [], isLoading: ordersLoading } = trpc.orders.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-gray-900">Please Login First</h1>
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

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logged out successfully");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="text-gray-700"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <AnimatedContent className="lg:col-span-1">
            <Card className="p-6 space-y-6 sticky top-4">
              {/* Profile Card */}
              <div className="space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2 border-t pt-6">
                <Button
                  onClick={() => navigate("/orders")}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-orange-600"
                >
                  <History className="w-4 h-4 mr-2" />
                  My Orders
                </Button>
                <Button
                  onClick={() => navigate("/addresses")}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-orange-600"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Saved Addresses
                </Button>
              </div>

              {/* Logout */}
              <Button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </Card>
          </AnimatedContent>

          {/* Main Content */}
          <AnimatedContent className="lg:col-span-2 space-y-6" reverse={true}>
            {/* Profile Section */}
            <Card className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <p className="text-lg text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <p className="text-lg text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Account Type</label>
                  <p className="text-lg text-gray-900 capitalize">{user?.role}</p>
                </div>
              </div>
            </Card>

            {/* Recent Orders - Only show if user has orders */}
            {userOrders && userOrders.length > 0 && (
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Recent Orders</h3>
                  <Button
                    onClick={() => navigate("/orders")}
                    variant="outline"
                    size="sm"
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {userOrders.slice(0, 3).map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 cursor-pointer transition"
                      onClick={() => navigate(`/order/${order.orderNumber}`)}
                    >
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-600">₱{(order.totalAmount / 100).toFixed(2)}</p>
                        <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Saved Addresses */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Saved Addresses</h3>
                <Button
                  onClick={() => navigate("/addresses")}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  size="sm"
                >
                  Manage Addresses
                </Button>
              </div>
              <p className="text-gray-600">
                You can manage your delivery addresses by clicking the button above.
              </p>
            </Card>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
}
