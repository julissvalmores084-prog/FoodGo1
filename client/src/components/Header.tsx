import { LogOut, User, Menu, X, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { useState } from 'react';
import { useLocation } from 'wouter';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-orange-200">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate('/')}
          >
            <div className="animate-flashing-logo perspective-1000">
              <span className="font-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                FoodGo
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigate('/restaurants')}
              className="font-body text-gray-700 hover:text-orange-600 transition"
            >
              Restaurants
            </button>
            <button 
              onClick={() => navigate('/search')}
              className="font-body text-gray-700 hover:text-orange-600 transition flex items-center gap-2"
            >
              <Search size={18} />
              Search
            </button>
            {isAuthenticated && (
              <button 
                onClick={() => navigate('/cart')}
                className="font-body text-gray-700 hover:text-orange-600 transition flex items-center gap-2"
              >
                <ShoppingCart size={18} />
                Cart
              </button>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                  <User size={18} className="text-green-600" />
                  <span className="font-heading text-sm text-green-700">{user.name || user.email}</span>
                </div>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="hidden md:flex items-center gap-2 border-2 border-blue-300 hover:bg-blue-50 text-blue-600 font-heading"
                >
                  <User size={18} />
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-red-300 hover:bg-red-50 text-red-600 font-heading"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-heading px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Login
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-gray-200 pt-4">
            <button 
              onClick={() => {
                navigate('/restaurants');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-lg transition"
            >
              Restaurants
            </button>
            <button 
              onClick={() => {
                navigate('/search');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-lg transition flex items-center gap-2"
            >
              <Search size={18} />
              Search
            </button>
            {isAuthenticated && (
              <>
                <button 
                  onClick={() => {
                    navigate('/cart');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-lg transition flex items-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Cart
                </button>
                <button 
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-lg transition flex items-center gap-2"
                >
                  <User size={18} />
                  Dashboard
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
