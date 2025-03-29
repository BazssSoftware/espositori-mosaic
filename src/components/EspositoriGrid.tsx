
import React, { useState } from 'react';
import { Espositore } from "@/types/espositore";
import EspositoreCard from "./EspositoreCard";
import EspositoreModal from "./EspositoreModal";

interface EspositoriGridProps {
  espositori: Espositore[];
}

const EspositoriGrid: React.FC<EspositoriGridProps> = ({ espositori }) => {
  const [selectedEspositore, setSelectedEspositore] = useState<Espositore | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEspositoreClick = (espositore: Espositore) => {
    setSelectedEspositore(espositore);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {espositori.map((espositore) => (
          <EspositoreCard 
            key={espositore.id} 
            espositore={espositore} 
            onClick={handleEspositoreClick} 
          />
        ))}
      </div>
      
      <EspositoreModal 
        espositore={selectedEspositore} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default EspositoriGrid;
