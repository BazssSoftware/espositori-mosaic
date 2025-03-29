
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GestioneFiere from '@/components/GestioneFiere';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { fiere as fiereInitial } from '@/data/fiere';
import { Fiera } from '@/types/fiera';

const GestioneFierePage: React.FC = () => {
  const [fiere, setFiere] = useState<Fiera[]>(fiereInitial);
  const navigate = useNavigate();

  const handleUpdateFiere = (updatedFiere: Fiera[]) => {
    setFiere(updatedFiere);
    // In un'app reale, qui salveremmo le fiere nel database
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline"
            className="border-wedding-primary/50 hover:bg-wedding-primary/20"
          >
            ← Torna all'admin
          </Button>
        </div>
        
        <GestioneFiere 
          fiereList={fiere}
          onUpdateFiere={handleUpdateFiere}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default GestioneFierePage;
