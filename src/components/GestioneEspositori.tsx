
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Espositore } from "@/types/espositore";
import { getOpzioniFiere } from "@/data/fiere";
import { getOpzioniCategorie } from "@/data/categorie";
import { PenIcon, TrashIcon, MoreVerticalIcon } from "lucide-react";

interface GestioneEspositoriProps {
  espositori: Espositore[];
  onUpdateEspositore: (id: string, updatedEspositore: Omit<Espositore, 'id'>) => void;
  onDeleteEspositore: (id: string) => void;
}

const GestioneEspositori: React.FC<GestioneEspositoriProps> = ({
  espositori,
  onUpdateEspositore,
  onDeleteEspositore
}) => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEspositore, setCurrentEspositore] = useState<Espositore | null>(null);
  
  // Form states
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editFairLocation, setEditFairLocation] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editSelectedFiere, setEditSelectedFiere] = useState<string[]>([]);
  const [editSelectedCategories, setEditSelectedCategories] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const opzioniFiere = getOpzioniFiere();
  const opzioniCategorie = getOpzioniCategorie();

  const filteredEspositori = espositori.filter(esp => 
    esp.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (espositore: Espositore) => {
    setCurrentEspositore(espositore);
    setEditName(espositore.name);
    setEditDescription(espositore.description);
    setEditLogoUrl(espositore.logoUrl);
    setEditWebsite(espositore.website || '');
    setEditPhoneNumber(espositore.phoneNumber || '');
    setEditEmail(espositore.email || '');
    setEditFairLocation(espositore.fairLocation || '');
    setEditImages(espositore.images || []);
    setEditSelectedFiere(espositore.fiere || []);
    setEditSelectedCategories(espositore.categories || []);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (espositore: Espositore) => {
    setCurrentEspositore(espositore);
    setIsDeleteDialogOpen(true);
  };

  const isValidEmail = (email: string) => {
    if (!email) return true; // Email è opzionale
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setEditImages([...editImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setEditImages(editImages.filter((_, i) => i !== index));
  };

  const handleSubmitEdit = () => {
    if (!currentEspositore) return;
    
    // Validazione
    if (!editName.trim() || !editDescription.trim() || !editLogoUrl.trim()) {
      toast({
        title: "Campi obbligatori mancanti",
        description: "Compila tutti i campi obbligatori (Nome, Descrizione, URL Logo).",
        variant: "destructive",
      });
      return;
    }

    if (editDescription.length < 100) {
      toast({
        title: "Descrizione troppo breve",
        description: "La descrizione deve contenere almeno 100 caratteri.",
        variant: "destructive",
      });
      return;
    }
    
    if (editEmail && !isValidEmail(editEmail)) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedEspositore: Omit<Espositore, 'id'> = {
      name: editName.trim(),
      description: editDescription.trim(),
      logoUrl: editLogoUrl.trim(),
      website: editWebsite.trim() || undefined,
      phoneNumber: editPhoneNumber.trim() || undefined,
      fairLocation: editFairLocation.trim() || undefined,
      email: editEmail.trim() || undefined,
      images: editImages.length > 0 ? [...editImages] : undefined,
      fiere: editSelectedFiere.length > 0 ? [...editSelectedFiere] : undefined,
      categories: editSelectedCategories.length > 0 ? [...editSelectedCategories] : undefined,
    };
    
    onUpdateEspositore(currentEspositore.id, updatedEspositore);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Espositore aggiornato",
      description: `${editName} è stato aggiornato con successo.`,
    });
  };

  const handleConfirmDelete = () => {
    if (currentEspositore) {
      onDeleteEspositore(currentEspositore.id);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Espositore eliminato",
        description: `${currentEspositore.name} è stato eliminato con successo.`,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-wedding-dark">Gestione Espositori</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Input
            placeholder="Cerca espositore..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {filteredEspositori.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Nessun espositore trovato
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sito Web</TableHead>
                  <TableHead>Categorie</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEspositori.map((espositore) => (
                  <TableRow key={espositore.id}>
                    <TableCell className="font-medium">{espositore.name}</TableCell>
                    <TableCell>{espositore.email || '-'}</TableCell>
                    <TableCell>{espositore.website || '-'}</TableCell>
                    <TableCell>
                      {espositore.categories && espositore.categories.length > 0 
                        ? espositore.categories.length > 2 
                          ? `${espositore.categories.length} categorie` 
                          : espositore.categories.join(', ')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="h-4 w-4" />
                            <span className="sr-only">Azioni</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(espositore)}>
                            <PenIcon className="mr-2 h-4 w-4" />
                            <span>Modifica</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(espositore)}
                            className="text-destructive focus:text-destructive"
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            <span>Elimina</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Dialog Modifica Espositore */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifica Espositore</DialogTitle>
              <DialogDescription>
                Aggiorna i dettagli dell'espositore
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Nome *</Label>
                  <Input
                    id="editName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="editDescription">Descrizione * (min. 100 caratteri)</Label>
                  <Textarea
                    id="editDescription"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={5}
                    required
                  />
                  <div className="text-sm text-muted-foreground">
                    {editDescription.length} / 100 caratteri minimi
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLogoUrl">URL Logo *</Label>
                  <Input
                    id="editLogoUrl"
                    value={editLogoUrl}
                    onChange={(e) => setEditLogoUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editWebsite">Sito Web</Label>
                  <Input
                    id="editWebsite"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhoneNumber">Numero di Telefono</Label>
                  <Input
                    id="editPhoneNumber"
                    value={editPhoneNumber}
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editFairLocation">Posizione in Fiera</Label>
                  <Input
                    id="editFairLocation"
                    value={editFairLocation}
                    onChange={(e) => setEditFairLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Fiere a cui partecipa</Label>
                  <MultiSelect
                    options={opzioniFiere}
                    selected={editSelectedFiere}
                    onChange={setEditSelectedFiere}
                    placeholder="Seleziona le fiere"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Categorie</Label>
                  <MultiSelect
                    options={opzioniCategorie}
                    selected={editSelectedCategories}
                    onChange={setEditSelectedCategories}
                    placeholder="Seleziona le categorie"
                  />
                </div>
              </div>
              
              {/* Immagini */}
              <div className="space-y-4 md:col-span-2">
                <Label>Immagini</Label>
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="URL Immagine"
                    className="flex-grow"
                  />
                  <Button type="button" onClick={handleAddImage} variant="outline">
                    Aggiungi
                  </Button>
                </div>
                
                {editImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Immagini aggiunte:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {editImages.map((img, index) => (
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
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Annulla
              </Button>
              <Button onClick={handleSubmitEdit}>Salva Modifiche</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Conferma Eliminazione */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Conferma Eliminazione</DialogTitle>
              <DialogDescription>
                Sei sicuro di voler eliminare questo espositore? Questa azione non può essere annullata.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Annulla
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
              >
                Elimina
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GestioneEspositori;
