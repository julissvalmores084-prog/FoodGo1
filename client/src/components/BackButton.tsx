import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
}

export default function BackButton({ fallbackPath = '/', className = '' }: BackButtonProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    // Try to go back in browser history
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to specified path if no history
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      onClick={handleBack}
      variant="outline"
      className={`flex items-center gap-2 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${className}`}
    >
      <ArrowLeft size={18} />
      Back
    </Button>
  );
}
