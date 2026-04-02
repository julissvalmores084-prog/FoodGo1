import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, LogIn } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">
            FoodGo
          </h1>
          <p className="text-gray-600 text-sm">Fast, Fresh, Delicious Food Delivery</p>
        </div>

        {/* Login Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Sign in to your account to continue ordering</p>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-6 rounded-lg flex items-center justify-center gap-2 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            Sign In with Manus
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Sign Up Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-3">
              <span className="font-semibold">Don't have an account?</span> Click the button above to create one during sign-in.
            </p>
            <p className="text-xs text-gray-600">
              Your account will be created automatically with your email and profile information.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Fast Checkout</p>
                <p className="text-xs text-gray-600">Save your delivery address for quick orders</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Order History</p>
                <p className="text-xs text-gray-600">Track all your previous orders</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Real-time Tracking</p>
                <p className="text-xs text-gray-600">Know exactly when your food arrives</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-600">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </Card>
    </div>
  );
}
