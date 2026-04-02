import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";
import AnimatedContent from "@/components/AnimatedContent";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    deliveryTime: "",
    deliveryFee: "",
  });

  const { data: restaurants, isLoading } = trpc.restaurants.list.useQuery(undefined);
  const createRestaurantMutation = trpc.restaurants.create.useMutation();
  const deleteRestaurantMutation = trpc.restaurants.delete.useMutation();

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

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-lg text-gray-600">
            You don't have permission to access the admin dashboard.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createRestaurantMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        deliveryTime: formData.deliveryTime ? parseInt(formData.deliveryTime) : undefined,
        deliveryFee: formData.deliveryFee ? parseInt(formData.deliveryFee) * 100 : undefined,
      });

      toast.success("Restaurant added successfully!");
      setFormData({ name: "", description: "", category: "", deliveryTime: "", deliveryFee: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add restaurant:", error);
      toast.error("Failed to add restaurant");
    }
  };

  const handleDeleteRestaurant = async (id: number) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }

    try {
      await deleteRestaurantMutation.mutateAsync({ id });
      toast.success("Restaurant deleted successfully!");
    } catch (error) {
      console.error("Failed to delete restaurant:", error);
      toast.error("Failed to delete restaurant");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Add Restaurant Form */}
        {showAddForm && (
          <AnimatedContent>
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Restaurant</h2>
            <form onSubmit={handleAddRestaurant} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter restaurant name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Filipino, Fast Food"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter restaurant description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Fee (₱)
                  </label>
                  <input
                    type="number"
                    name="deliveryFee"
                    value={formData.deliveryFee}
                    onChange={handleInputChange}
                    placeholder="e.g., 50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Add Restaurant
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
          </AnimatedContent>
        )}

        {/* Restaurants List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Restaurants</h2>
            {!showAddForm && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Restaurant
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
            </div>
          ) : restaurants && restaurants.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {restaurants.map(restaurant => (
                <AnimatedContent key={restaurant.id}>
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {restaurant.name}
                      </h3>
                      <p className="text-gray-600 mt-1">{restaurant.description}</p>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {restaurant.category}
                        </span>
                        {restaurant.deliveryTime && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            ⏱️ {restaurant.deliveryTime} min
                          </span>
                        )}
                        {restaurant.deliveryFee && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            💵 ₱{(restaurant.deliveryFee / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteRestaurant(restaurant.id)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
                </AnimatedContent>
              ))}
            </div>
          ) : (
            <AnimatedContent>
            <Card className="p-12 text-center">
              <p className="text-gray-600">No restaurants found</p>
            </Card>
            </AnimatedContent>
          )}
        </div>
      </div>
    </div>
  );
}
