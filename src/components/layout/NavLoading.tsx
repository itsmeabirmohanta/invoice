import React from 'react';

interface NavLoadingProps {
  isLoading: boolean;
}

const NavLoading: React.FC<NavLoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent overflow-hidden">
      <div className="h-full bg-blue-600 animate-nav-loading"></div>
      
      <style jsx>{`
        @keyframes navLoading {
          0% {
            width: 0%;
            transform: translateX(0%);
          }
          50% {
            width: 50%;
            transform: translateX(100%);
          }
          100% {
            width: 10%;
            transform: translateX(1000%);
          }
        }
        
        .animate-nav-loading {
          animation: navLoading 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NavLoading; 