import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoginModalProps {
  onLogin: (name: string) => void;
  onClose: () => void;
}

export default function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    onLogin(name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border-2 border-orange-200 perspective-1000">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-2xl"></div>
          </div>
          <div className="relative flex items-center justify-between">
            <h2 className="font-display text-3xl text-white">Welcome to FoodGo</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-white/90 font-body mt-2">
            Login to rate restaurants and place orders
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name Input */}
          <div>
            <label className="block font-heading text-sm text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 font-body transition-all"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block font-heading text-sm text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 font-body transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-red-700 font-body text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full button-3d bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-heading py-3 rounded-xl text-lg"
          >
            Login & Start Rating
          </Button>

          {/* Demo Info */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
            <p className="text-xs font-heading text-blue-700 mb-2 uppercase tracking-wide">
              Demo Credentials
            </p>
            <p className="text-sm text-blue-600 font-body">
              Try any name and email to test the rating system
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
