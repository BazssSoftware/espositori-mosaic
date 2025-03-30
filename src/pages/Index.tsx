
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EspositoriGrid from '@/components/EspositoriGrid';
import { espositori } from '@/data/espositori';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOpzioniCategorie } from '@/data/categorie';
import { getOpzioniFiere } from '@/data/fiere';
import { MultiSelect } from '@/components/ui/multi-select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const Index: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFiere, setSelectedFiere] = useState<string[]>([]);
  
  const opzioniCategorie = getOpzioniCategorie();
  const opzioniFiere = getOpzioniFiere();
  
  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedFiere([]);
  };
  
  const filteredEspositori = useMemo(() => {
    return espositori.filter(espositore => {
      // Filtra per categoria se selezionata
      if (selectedCategory && espositore.categories) {
        if (!espositore.categories.includes(selectedCategory)) {
          return false;
        }
      }
      
      // Filtra per fiere se selezionate
      if (selectedFiere.length > 0 && espositore.fiere) {
        // Verifica se l'espositore partecipa ad almeno una delle fiere selezionate
        const partecipaSelezione = selectedFiere.some(fieraId => 
          espositore.fiere?.includes(fieraId)
        );
        if (!partecipaSelezione) {
          return false;
        }
      }
      
      return true;
    });
  }, [espositori, selectedCategory, selectedFiere]);
  
  const hasActiveFilters = selectedCategory || selectedFiere.length > 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-wedding-dark mb-3">Sposi Oggi Magazine</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nel frattempo che aspetti la prossima Fiera Sposi Oggi, scopri in anteprima quali saranno i nostri espositori!
          </p>
        </div>
        
        <div className="mb-8 bg-muted/30 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4 text-wedding-dark">Filtra Espositori</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Tutte le categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tutte le categorie</SelectItem>
                  {opzioniCategorie.map(categoria => (
                    <SelectItem key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Fiere</label>
              <MultiSelect
                options={opzioniFiere}
                selected={selectedFiere}
                onChange={setSelectedFiere}
                placeholder="Tutte le fiere"
              />
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" /> Rimuovi filtri
              </Button>
            </div>
          )}
        </div>
        
        <div className="mb-4 flex justify-between items-center">
          <p className="text-muted-foreground">
            {filteredEspositori.length} {filteredEspositori.length === 1 ? 'espositore trovato' : 'espositori trovati'}
          </p>
          
          {hasActiveFilters && filteredEspositori.length === 0 && (
            <p className="text-orange-500 text-center my-4">
              Nessun espositore corrisponde ai filtri selezionati.
            </p>
          )}
        </div>
        
        <EspositoriGrid espositori={filteredEspositori} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
