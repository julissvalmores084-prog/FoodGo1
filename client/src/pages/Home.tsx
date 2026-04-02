import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Zap, MapPin, Clock } from "lucide-react";
import { getLoginUrl } from "@/const";
import AnimatedContent from "@/components/AnimatedContent";

/**
 * FoodGo Landing Page - Food Delivery Platform
 * This is the main landing page showcasing restaurants and food delivery services
 */
export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section with Food Background */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden" style={{
        backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663505341054/dyrz4oDf3V9QzFfnjxjshV/food-background-collage-2NEmXkSefRsXYfr2cSdAvk.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <AnimatedContent className="space-y-8" direction="vertical" distance={50}>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">FoodGo</span>
                </h1>
                <p className="text-xl text-gray-600" style={{color: '#f0eaea'}}>
                  Fast, Fresh, Delicious Food Delivered to Your Door
                </p>
              </div>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-green-200" style={{backgroundColor: '#663885'}}>
                    <p className="text-lg text-green-600 font-semibold mb-2" style={{color: '#f9ebeb'}}>
                      Welcome, {user?.name}! 🎉
                    </p>
                    <p className="text-gray-600 text-sm" style={{color: '#e2dada'}}>
                      Ready to order some delicious food?
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => navigate("/restaurants")}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Browse Restaurants
                    </Button>
                    <Button
                      onClick={() => navigate("/search")}
                      variant="outline"
                      className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-bold px-8 py-6 text-lg rounded-xl"
                    >
                      Search Food
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Sign in to start ordering from your favorite restaurants
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleLogin}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => navigate("/login")}
                      variant="outline"
                      className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-bold px-8 py-6 text-lg rounded-xl"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              )}
            </AnimatedContent>

            {/* Right Visual */}
            <AnimatedContent className="hidden md:flex items-center justify-center" direction="vertical" distance={50} reverse={true}>
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-red-200 rounded-3xl opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  🍗🍜🍕
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>
      </section>

      {/* Why Choose FoodGo Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose <span className="text-orange-600">FoodGo</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <AnimatedContent>
            <Card className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6 mx-auto">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-600 text-center">
                Get your food delivered in 30 minutes or less. We guarantee speed without compromising quality.
              </p>
            </Card>
            </AnimatedContent>

            {/* Feature 2 */}
            <AnimatedContent>
            <Card className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 mx-auto">
                <MapPin className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Wide Selection
              </h3>
              <p className="text-gray-600 text-center">
                Choose from hundreds of restaurants and cuisines. From Filipino favorites to international dishes.
              </p>
            </Card>
            </AnimatedContent>

            {/* Feature 3 */}
            <AnimatedContent>
            <Card className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Real-Time Tracking
              </h3>
              <p className="text-gray-600 text-center">
                Track your order in real-time and know exactly when your food will arrive at your door.
              </p>
            </Card>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      {isAuthenticated && (
        <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Popular Restaurants
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Discover your favorite restaurants and order now
            </p>

            <AnimatedContent className="text-center">
              <Button
                onClick={() => navigate("/restaurants")}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                View All Restaurants
              </Button>
            </AnimatedContent>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-red-600">
          <AnimatedContent className="container max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of happy customers enjoying delicious food delivered fast
            </p>
            <Button
              onClick={handleLogin}
              className="bg-white hover:bg-gray-100 text-orange-600 font-bold px-8 py-4 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Sign In Now
            </Button>
          </AnimatedContent>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold text-orange-400 mb-4">FoodGo</h4>
              <p className="text-gray-400">
                Your favorite Filipino fast food, delivered fast and fresh.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition">Facebook</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Instagram</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2026 FoodGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function handleLogin() {
  window.location.href = getLoginUrl();
}
