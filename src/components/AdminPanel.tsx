
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Espositore } from "@/types/espositore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/ui/multi-select";
import { getOpzioniFiere } from "@/data/fiere";
import { getOpzioniCategorie } from "@/data/categorie";
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminPanelProps {
  onAddEspositore: (espositore: Omit<Espositore, 'id'>) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddEspositore }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fairLocation, setFairLocation] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiere, setSelectedFiere] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const opzioniFiere = getOpzioniFiere();
  const opzioniCategorie = getOpzioniCategorie();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione
    if (!name.trim() || !description.trim() || !logoUrl.trim()) {
      toast({
        title: "Campi obbligatori mancanti",
        description: "Compila tutti i campi obbligatori (Nome, Descrizione, URL Logo).",
        variant: "destructive",
      });
      return;
    }

    if (description.length < 100) {
      toast({
        title: "Descrizione troppo breve",
        description: "La descrizione deve contenere almeno 100 caratteri.",
        variant: "destructive",
      });
      return;
    }
    
    if (email && !isValidEmail(email)) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive",
      });
      return;
    }
    
    // Categoria singola invece di array di categorie
    const categoriaArray = selectedCategory ? [selectedCategory] : [];
    
    // Ensure arrays are defined
    const newEspositore: Omit<Espositore, 'id'> = {
      name: name.trim(),
      description: description.trim(),
      logoUrl: logoUrl.trim(),
      website: website.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      fairLocation: fairLocation.trim() || undefined,
      email: email.trim() || undefined,
      images: images.length > 0 ? [...images] : [],
      fiere: selectedFiere.length > 0 ? [...selectedFiere] : [],
      categories: categoriaArray,
    };
    
    // Aggiunta dell'espositore
    onAddEspositore(newEspositore);
    
    // Reset del form
    setName('');
    setDescription('');
    setLogoUrl('');
    setWebsite('');
    setPhoneNumber('');
    setFairLocation('');
    setEmail('');
    setImageUrl('');
    setImages([]);
    setSelectedFiere([]);
    setSelectedCategory('');
    
    // Mostra messaggio di successo
    toast({
      title: "Espositore aggiunto",
      description: `${name} è stato aggiunto con successo all'elenco degli espositori.`,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-wedding-dark">Aggiungi Nuovo Espositore</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6">
          <Button
            onClick={() => navigate('/admin/fiere')}
            variant="outline"
            className="border-wedding-primary/50 hover:bg-wedding-primary/20"
          >
            Gestione Fiere
          </Button>
          
          <Button
            onClick={() => navigate('/admin/categorie')}
            variant="outline"
            className="border-wedding-primary/50 hover:bg-wedding-primary/20"
          >
            Gestione Categorie
          </Button>
          
          <Button
            onClick={() => navigate('/admin/espositori')}
            variant="outline"
            className="border-wedding-primary/50 hover:bg-wedding-primary/20"
          >
            Gestione Espositori
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-wedding-dark">Nome *</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Nome Espositore" 
                required
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-wedding-dark">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="esempio@dominio.it"
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-wedding-dark">Descrizione * (min. 100 caratteri)</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Descrizione dettagliata dell'espositore" 
                required 
                rows={4}
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
              <div className="text-sm text-muted-foreground">
                {description.length} / 100 caratteri minimi
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logoUrl" className="text-wedding-dark">URL Logo *</Label>
              <Input 
                id="logoUrl" 
                value={logoUrl} 
                onChange={(e) => setLogoUrl(e.target.value)} 
                placeholder="https://esempio.com/logo.jpg" 
                required
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website" className="text-wedding-dark">Sito Web</Label>
              <Input 
                id="website" 
                value={website} 
                onChange={(e) => setWebsite(e.target.value)} 
                placeholder="https://www.esempio.com"
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-wedding-dark">Numero di Telefono</Label>
              <Input 
                id="phoneNumber" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                placeholder="+39 123 456 7890"
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fairLocation" className="text-wedding-dark">Posizione in Fiera</Label>
              <Input 
                id="fairLocation" 
                value={fairLocation} 
                onChange={(e) => setFairLocation(e.target.value)} 
                placeholder="Es. Padiglione A, Stand 12"
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-wedding-dark">Fiere a cui partecipa</Label>
              <MultiSelect
                options={opzioniFiere}
                selected={selectedFiere}
                onChange={setSelectedFiere}
                placeholder="Seleziona le fiere"
                className="border-wedding-primary/50"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-wedding-dark">Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-wedding-primary/50">
                  <SelectValue placeholder="Seleziona una categoria" />
                </SelectTrigger>
                <SelectContent>
                  {opzioniCategorie.map((categoria) => (
                    <SelectItem key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator className="my-4 bg-wedding-primary/30" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-wedding-dark">Immagini</h3>
            
            <div className="flex gap-2">
              <Input 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                placeholder="URL Immagine" 
                className="flex-grow border-wedding-primary/50 focus:border-wedding-primary"
              />
              <Button 
                type="button" 
                onClick={handleAddImage}
                variant="outline"
                className="border-wedding-primary/50 hover:bg-wedding-primary/20"
              >
                Aggiungi Immagine
              </Button>
            </div>
            
            {images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Immagini aggiunte:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="truncate flex-grow mr-2">{img}</div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveImage(index)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        Rimuovi
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="bg-wedding-gold hover:bg-wedding-gold/90 text-white min-w-32"
            >
              Aggiungi Espositore
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
