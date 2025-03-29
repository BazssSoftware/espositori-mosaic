
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-wedding-primary to-wedding-secondary py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-white p-1">
              <AvatarImage src="/logo-sposi-oggi.png" alt="Sposi Oggi Logo" />
              <AvatarFallback>SO</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl md:text-4xl font-semibold text-wedding-dark mb-0">
              Sposi Oggi
            </h1>
          </Link>
          
          <nav className="flex space-x-4 md:space-x-8 mt-4 md:mt-0">
            <Link 
              to="/" 
              className="text-wedding-dark hover:text-wedding-dark/70 transition-colors"
            >
              Espositori
            </Link>
            <Link 
              to="/admin" 
              className="text-wedding-dark hover:text-wedding-dark/70 transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
