
import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-wedding-dark text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold">Sposi Oggi</h2>
            <p className="text-sm text-gray-300 mt-1">La fiera dedicata al tuo matrimonio perfetto</p>
          </div>
          
          <div className="text-sm text-gray-300">
            &copy; {year} Sposi Oggi. Tutti i diritti riservati.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
