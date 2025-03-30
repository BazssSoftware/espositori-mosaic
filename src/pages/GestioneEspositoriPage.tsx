
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GestioneEspositori from '@/components/GestioneEspositori';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { espositori as initialEspositori } from '@/data/espositori';
import { Espositore } from '@/types/espositore';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const GestioneEspositoriPage: React.FC = () => {
  const [espositori, setEspositori] = useState<Espositore[]>(initialEspositori);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error('Errore nel controllo della sessione:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Ascolta i cambiamenti di autenticazione
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUpdateEspositore = (id: string, updatedEspositore: Omit<Espositore, 'id'>) => {
    // Ensure all fields are properly defined
    const sanitizedEspositore: Omit<Espositore, 'id'> = {
      ...updatedEspositore,
      fiere: updatedEspositore.fiere || [],
      categories: updatedEspositore.categories || [],
    };

    setEspositori(espositori.map(esp => 
      esp.id === id ? { ...sanitizedEspositore, id } : esp
    ));
    
    // In un'applicazione reale, qui invieresti i dati aggiornati al tuo backend
    console.log('Espositore aggiornato:', { id, ...sanitizedEspositore });
    
    toast({
      title: "Espositore aggiornato",
      description: "L'espositore è stato aggiornato con successo.",
    });
  };

  const handleDeleteEspositore = (id: string) => {
    setEspositori(espositori.filter(esp => esp.id !== id));
    
    // In un'applicazione reale, qui invieresti una richiesta di eliminazione al tuo backend
    console.log('Espositore eliminato:', id);
    
    toast({
      title: "Espositore eliminato",
      description: "L'espositore è stato eliminato con successo.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10 flex justify-center items-center">
          <p>Caricamento...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-wedding-dark mb-3">Gestione Espositori</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gestisci gli espositori esistenti per la fiera Sposi Oggi. Puoi modificare o eliminare gli espositori.
          </p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              className="border-wedding-primary/50 hover:bg-wedding-primary/20"
            >
              Torna alla Dashboard
            </Button>
            
            <Button
              onClick={handleLogout}
              className="bg-wedding-dark text-white hover:bg-wedding-dark/80"
            >
              Logout
            </Button>
          </div>
        </div>
        
        <GestioneEspositori 
          espositori={espositori}
          onUpdateEspositore={handleUpdateEspositore}
          onDeleteEspositore={handleDeleteEspositore}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default GestioneEspositoriPage;
