
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fiera } from "@/types/fiera";
import { Separator } from "@/components/ui/separator";
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Edit } from "lucide-react";

interface GestioneFiereProps {
  fiereList: Fiera[];
  onUpdateFiere: (fiere: Fiera[]) => void;
}

const GestioneFiere: React.FC<GestioneFiereProps> = ({ fiereList, onUpdateFiere }) => {
  const { toast } = useToast();
  const [fiere, setFiere] = useState<Fiera[]>(fiereList);
  const [nomeFiera, setNomeFiera] = useState('');
  const [dataFiera, setDataFiera] = useState('');
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editData, setEditData] = useState('');

  const handleAddFiera = () => {
    if (!nomeFiera.trim() || !dataFiera.trim()) {
      toast({
        title: "Dati mancanti",
        description: "Inserisci nome e data della fiera",
        variant: "destructive",
      });
      return;
    }

    const nuovaFiera: Fiera = {
      id: uuidv4(),
      nome: nomeFiera.trim(),
      data: dataFiera.trim()
    };

    const nuoveFiere = [...fiere, nuovaFiera];
    setFiere(nuoveFiere);
    onUpdateFiere(nuoveFiere);
    
    setNomeFiera('');
    setDataFiera('');
    
    toast({
      title: "Fiera aggiunta",
      description: `${nomeFiera} è stata aggiunta all'elenco delle fiere.`,
    });
  };

  const handleDeleteFiera = (id: string) => {
    const nuoveFiere = fiere.filter(fiera => fiera.id !== id);
    setFiere(nuoveFiere);
    onUpdateFiere(nuoveFiere);
    
    toast({
      title: "Fiera eliminata",
      description: "La fiera è stata rimossa dall'elenco.",
    });
  };

  const handleStartEdit = (fiera: Fiera) => {
    setEditMode(fiera.id);
    setEditNome(fiera.nome);
    setEditData(fiera.data);
  };

  const handleSaveEdit = (id: string) => {
    if (!editNome.trim() || !editData.trim()) {
      toast({
        title: "Dati mancanti",
        description: "Inserisci nome e data della fiera",
        variant: "destructive",
      });
      return;
    }

    const nuoveFiere = fiere.map(fiera => 
      fiera.id === id 
        ? { ...fiera, nome: editNome.trim(), data: editData.trim() } 
        : fiera
    );
    
    setFiere(nuoveFiere);
    onUpdateFiere(nuoveFiere);
    setEditMode(null);
    
    toast({
      title: "Fiera aggiornata",
      description: "Le informazioni della fiera sono state aggiornate.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-wedding-dark">Gestione Fiere</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-wedding-dark">Aggiungi una nuova fiera</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeFiera" className="text-wedding-dark">Nome fiera</Label>
                <Input 
                  id="nomeFiera" 
                  value={nomeFiera} 
                  onChange={(e) => setNomeFiera(e.target.value)} 
                  placeholder="Es. Fiera Sposi Oggi Milano" 
                  className="border-wedding-primary/50 focus:border-wedding-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataFiera" className="text-wedding-dark">Data fiera</Label>
                <Input 
                  id="dataFiera" 
                  value={dataFiera} 
                  onChange={(e) => setDataFiera(e.target.value)} 
                  placeholder="Es. 10 e 11 ottobre 2025" 
                  className="border-wedding-primary/50 focus:border-wedding-primary"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleAddFiera}
                className="bg-wedding-gold hover:bg-wedding-gold/90 text-white"
              >
                Aggiungi Fiera
              </Button>
            </div>
          </div>
          
          <Separator className="my-4 bg-wedding-primary/30" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-wedding-dark">Elenco Fiere</h3>
            
            {fiere.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nessuna fiera presente</p>
            ) : (
              <div className="space-y-2">
                {fiere.map((fiera) => (
                  <div key={fiera.id} className="border rounded-md p-3 flex items-center justify-between">
                    {editMode === fiera.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow mr-2">
                        <Input 
                          value={editNome} 
                          onChange={(e) => setEditNome(e.target.value)}
                          className="border-wedding-primary/50"
                        />
                        <Input 
                          value={editData} 
                          onChange={(e) => setEditData(e.target.value)}
                          className="border-wedding-primary/50"
                        />
                        <Button 
                          onClick={() => handleSaveEdit(fiera.id)}
                          className="bg-wedding-gold hover:bg-wedding-gold/90 text-white md:col-span-2"
                        >
                          Salva Modifiche
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-grow mr-2">
                        <p className="font-medium">{fiera.nome}</p>
                        <p className="text-sm text-muted-foreground">{fiera.data}</p>
                      </div>
                    )}
                    
                    {editMode !== fiera.id && (
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleStartEdit(fiera)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDeleteFiera(fiera.id)}
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

export default GestioneFiere;
