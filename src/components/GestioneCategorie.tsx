
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Categoria } from "@/types/categoria";
import { Separator } from "@/components/ui/separator";
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Edit } from "lucide-react";

interface GestioneCategorieProps {
  categorieList: Categoria[];
  onUpdateCategorie: (categorie: Categoria[]) => void;
}

const GestioneCategorie: React.FC<GestioneCategorieProps> = ({ categorieList, onUpdateCategorie }) => {
  const { toast } = useToast();
  const [categorie, setCategorie] = useState<Categoria[]>(categorieList);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');

  const handleAddCategoria = () => {
    if (!nomeCategoria.trim()) {
      toast({
        title: "Dato mancante",
        description: "Inserisci il nome della categoria",
        variant: "destructive",
      });
      return;
    }

    const nuovaCategoria: Categoria = {
      id: uuidv4(),
      nome: nomeCategoria.trim()
    };

    const nuoveCategorie = [...categorie, nuovaCategoria];
    setCategorie(nuoveCategorie);
    onUpdateCategorie(nuoveCategorie);
    
    setNomeCategoria('');
    
    toast({
      title: "Categoria aggiunta",
      description: `${nomeCategoria} è stata aggiunta all'elenco delle categorie.`,
    });
  };

  const handleDeleteCategoria = (id: string) => {
    const nuoveCategorie = categorie.filter(categoria => categoria.id !== id);
    setCategorie(nuoveCategorie);
    onUpdateCategorie(nuoveCategorie);
    
    toast({
      title: "Categoria eliminata",
      description: "La categoria è stata rimossa dall'elenco.",
    });
  };

  const handleStartEdit = (categoria: Categoria) => {
    setEditMode(categoria.id);
    setEditNome(categoria.nome);
  };

  const handleSaveEdit = (id: string) => {
    if (!editNome.trim()) {
      toast({
        title: "Dato mancante",
        description: "Inserisci il nome della categoria",
        variant: "destructive",
      });
      return;
    }

    const nuoveCategorie = categorie.map(categoria => 
      categoria.id === id 
        ? { ...categoria, nome: editNome.trim() } 
        : categoria
    );
    
    setCategorie(nuoveCategorie);
    onUpdateCategorie(nuoveCategorie);
    setEditMode(null);
    
    toast({
      title: "Categoria aggiornata",
      description: "Il nome della categoria è stato aggiornato.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-wedding-dark">Gestione Categorie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-wedding-dark">Aggiungi una nuova categoria</h3>
            
            <div className="flex space-x-2">
              <div className="space-y-2 flex-grow">
                <Label htmlFor="nomeCategoria" className="text-wedding-dark">Nome categoria</Label>
                <Input 
                  id="nomeCategoria" 
                  value={nomeCategoria} 
                  onChange={(e) => setNomeCategoria(e.target.value)} 
                  placeholder="Es. Catering" 
                  className="border-wedding-primary/50 focus:border-wedding-primary"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={handleAddCategoria}
                  className="bg-wedding-gold hover:bg-wedding-gold/90 text-white h-10"
                >
                  Aggiungi
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="my-4 bg-wedding-primary/30" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-wedding-dark">Elenco Categorie</h3>
            
            {categorie.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nessuna categoria presente</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categorie.map((categoria) => (
                  <div key={categoria.id} className="border rounded-md p-3 flex items-center justify-between">
                    {editMode === categoria.id ? (
                      <div className="flex-grow mr-2 space-y-2">
                        <Input 
                          value={editNome} 
                          onChange={(e) => setEditNome(e.target.value)}
                          className="border-wedding-primary/50"
                        />
                        <Button 
                          onClick={() => handleSaveEdit(categoria.id)}
                          className="bg-wedding-gold hover:bg-wedding-gold/90 text-white w-full"
                        >
                          Salva
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-grow mr-2">
                        <p className="font-medium">{categoria.nome}</p>
                      </div>
                    )}
                    
                    {editMode !== categoria.id && (
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleStartEdit(categoria)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDeleteCategoria(categoria.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GestioneCategorie;
