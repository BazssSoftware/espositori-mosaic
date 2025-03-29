
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GestioneCategorie from '@/components/GestioneCategorie';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { categorie as categorieInitial } from '@/data/categorie';
import { Categoria } from '@/types/categoria';

const GestioneCategoriePage: React.FC = () => {
  const [categorie, setCategorie] = useState<Categoria[]>(categorieInitial);
  const navigate = useNavigate();

  const handleUpdateCategorie = (updatedCategorie: Categoria[]) => {
    setCategorie(updatedCategorie);
    // In un'app reale, qui salveremmo le categorie nel database
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
        
        <GestioneCategorie 
          categorieList={categorie}
          onUpdateCategorie={handleUpdateCategorie}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default GestioneCategoriePage;
