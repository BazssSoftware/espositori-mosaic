
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Espositore } from "@/types/espositore";

interface EspositoreCardProps {
  espositore: Espositore;
  onClick: (espositore: Espositore) => void;
}

const EspositoreCard: React.FC<EspositoreCardProps> = ({ espositore, onClick }) => {
  return (
    <Card 
      className="espositore-card w-full shadow-sm hover:shadow-md cursor-pointer bg-white"
      onClick={() => onClick(espositore)}
    >
      <CardContent className="p-4">
        <div className="logo-container mb-4 overflow-hidden">
          <img 
            src={espositore.logoUrl} 
            alt={`${espositore.name} logo`} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <h3 className="text-lg font-semibold text-center text-wedding-dark truncate">
          {espositore.name}
        </h3>
        <p className="text-sm text-center text-muted-foreground mt-1">
          {espositore.category || "Exhibitor"}
        </p>
      </CardContent>
    </Card>
  );
};

export default EspositoreCard;
