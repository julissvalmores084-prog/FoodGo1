import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import BackButton from "@/components/BackButton";
import AnimatedContent from "@/components/AnimatedContent";

interface Address {
  id: number;
  label: string;
  address: string;
  city: string;
  isDefault: boolean;
}

export default function Addresses() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      label: "Home",
      address: "123 Main St, Apt 4B",
      city: "Manila",
      isDefault: true,
    },
    {
      id: 2,
      label: "Office",
      address: "456 Business Ave, Floor 10",
      city: "Makati",
      isDefault: false,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    address: "",
    city: "",
  });

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

  const handleAddAddress = () => {
    if (!formData.label || !formData.address || !formData.city) {
      toast.error("Please fill in all fields");
      return;
    }

    const newAddress: Address = {
      id: Math.max(...addresses.map(a => a.id), 0) + 1,
      label: formData.label,
      address: formData.address,
      city: formData.city,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, newAddress]);
    setFormData({ label: "", address: "", city: "" });
    setIsAdding(false);
    toast.success("Address added successfully");
  };

  const handleUpdateAddress = (id: number) => {
    if (!formData.label || !formData.address || !formData.city) {
      toast.error("Please fill in all fields");
      return;
    }

    setAddresses(
      addresses.map(a =>
        a.id === id
          ? {
              ...a,
              label: formData.label,
              address: formData.address,
              city: formData.city,
            }
          : a
      )
    );
    setEditingId(null);
    setFormData({ label: "", address: "", city: "" });
    toast.success("Address updated successfully");
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success("Address deleted successfully");
  };

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map(a => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    toast.success("Default address updated");
  };

  const handleEditStart = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      label: address.label,
      address: address.address,
      city: address.city,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-4xl font-bold text-gray-900">My Addresses</h1>
        </div>

        {/* Add/Edit Address Form */}
        {(isAdding || editingId) && (
          <AnimatedContent>
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Label (e.g., Home, Office)
                </label>
                <Input
                  placeholder="Address label"
                  value={formData.label}
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address
                </label>
                <Input
                  placeholder="123 Main St, Apt 4B"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <Input
                  placeholder="Manila"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    editingId
                      ? handleUpdateAddress(editingId)
                      : handleAddAddress()
                  }
                  className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {editingId ? "Update" : "Add"} Address
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({ label: "", address: "", city: "" });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
          </AnimatedContent>
        )}

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-xl text-gray-600 mb-6">No addresses yet</p>
              <Button
                onClick={() => setIsAdding(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Address
              </Button>
            </Card>
          ) : (
            <>
              {addresses.map(address => (
                <AnimatedContent key={address.id}>
                <Card className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {address.label}
                        </h3>
                        {address.isDefault && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {address.address}
                        </div>
                        <p className="text-sm">{address.city}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditStart(address)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {!address.isDefault && (
                        <Button
                          onClick={() => handleSetDefault(address.id)}
                          variant="outline"
                          size="sm"
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteAddress(address.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
                </AnimatedContent>
              ))}

              {!isAdding && !editingId && (
                <Button
                  onClick={() => setIsAdding(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Address
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
