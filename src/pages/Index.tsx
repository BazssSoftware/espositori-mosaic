
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EspositoriGrid from '@/components/EspositoriGrid';
import { espositori } from '@/data/espositori';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-wedding-dark mb-3">I Nostri Espositori</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scopri tutti gli espositori presenti alla fiera Sposi Oggi. Clicca sulle schede per visualizzare maggiori dettagli.
          </p>
        </div>
        
        <EspositoriGrid espositori={espositori} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
