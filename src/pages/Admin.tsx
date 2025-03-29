
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import { Espositore } from '@/types/espositore';
import { espositori } from '@/data/espositori';
import { v4 as uuidv4 } from 'uuid';

const Admin: React.FC = () => {
  const [espositoriList, setEspositoriList] = useState<Espositore[]>(espositori);

  const handleAddEspositore = (newEspositore: Omit<Espositore, 'id'>) => {
    const espositoreWithId: Espositore = {
      ...newEspositore,
      id: uuidv4(),
    };
    
    setEspositoriList([...espositoriList, espositoreWithId]);
    
    // In a real application, this is where you would send the data to your backend
    console.log('New espositore added:', espositoreWithId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-wedding-dark mb-3">Admin Panel</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage exhibitors for the Sposi Oggi fair. Add new exhibitors using the form below.
          </p>
        </div>
        
        <AdminPanel onAddEspositore={handleAddEspositore} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
