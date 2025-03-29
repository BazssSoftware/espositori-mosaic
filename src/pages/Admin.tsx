
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import Auth from '@/components/Auth';
import { Espositore } from '@/types/espositore';
import { espositori } from '@/data/espositori';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

const Admin: React.FC = () => {
  const [espositoriList, setEspositoriList] = useState<Espositore[]>(espositori);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error('Error checking session:', error);
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

  const handleAddEspositore = (newEspositore: Omit<Espositore, 'id'>) => {
    const espositoreWithId: Espositore = {
      ...newEspositore,
      id: uuidv4(),
    };
    
    setEspositoriList([...espositoriList, espositoreWithId]);
    
    // In a real application, this is where you would send the data to your backend
    console.log('New espositore added:', espositoreWithId);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-10">
        {isAuthenticated ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-semibold text-wedding-dark mb-3">Admin Panel</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Gestisci gli espositori per la fiera Sposi Oggi. Aggiungi nuovi espositori utilizzando il modulo sottostante.
              </p>
              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-wedding-dark text-white rounded-md hover:bg-wedding-dark/80 transition-colors"
              >
                Logout
              </button>
            </div>
            
            <AdminPanel onAddEspositore={handleAddEspositore} />
          </>
        ) : (
          <Auth onLoginSuccess={() => setIsAuthenticated(true)} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
