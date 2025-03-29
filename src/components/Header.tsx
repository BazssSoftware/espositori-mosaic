
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-wedding-primary to-wedding-secondary py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-wedding-dark mb-4 md:mb-0">
            Sposi Oggi
          </h1>
          
          <nav className="flex space-x-4 md:space-x-8">
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
