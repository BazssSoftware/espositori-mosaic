
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { Espositore } from "@/types/espositore";
import { generatePDF } from "@/utils/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";

interface EspositoreModalProps {
  espositore: Espositore | null;
  isOpen: boolean;
  onClose: () => void;
}

const EspositoreModal: React.FC<EspositoreModalProps> = ({ espositore, isOpen, onClose }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    if (!espositore) return;
    
    try {
      setIsGeneratingPDF(true);
      const pdfDataUrl = await generatePDF(espositore);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `${espositore.name.replace(/\s+/g, '-').toLowerCase()}-details.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "PDF Generato",
        description: "Le informazioni dell'espositore sono state scaricate in formato PDF.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Errore nella generazione del PDF:", error);
      toast({
        title: "Errore",
        description: "Impossibile generare il PDF. Riprova più tardi.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!espositore) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            {espositore.logoUrl && (
              <img 
                src={espositore.logoUrl} 
                alt={`${espositore.name} logo`} 
                className="max-h-20 max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>
          <DialogTitle className="text-2xl text-center text-wedding-dark">
            {espositore.name}
          </DialogTitle>
          {espositore.category && (
            <DialogDescription className="text-center">
              {espositore.category}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <Separator className="my-4 bg-wedding-primary/30" />
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-wedding-dark">Descrizione</h3>
            <p className="text-gray-700">{espositore.description}</p>
          </div>
          
          {espositore.website && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-wedding-dark">Sito Web</h3>
              <a 
                href={espositore.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                {espositore.website} <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          )}
          
          {espositore.phoneNumber && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-wedding-dark">Telefono</h3>
              <p className="text-gray-700 flex items-center">
                <Phone className="mr-1 h-4 w-4" /> {espositore.phoneNumber}
              </p>
            </div>
          )}
          
          {espositore.email && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-wedding-dark">Email</h3>
              <a 
                href={`mailto:${espositore.email}`}
                className="text-blue-600 hover:underline flex items-center"
              >
                <Mail className="mr-1 h-4 w-4" /> {espositore.email}
              </a>
            </div>
          )}
          
          {espositore.fairLocation && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-wedding-dark">Posizione Fiera</h3>
              <p className="text-gray-700">{espositore.fairLocation}</p>
            </div>
          )}
          
          {espositore.fiere && espositore.fiere.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-wedding-dark">Partecipa alle Fiere</h3>
              <ul className="list-disc pl-5">
                {espositore.fiere.map((fiera, index) => (
                  <li key={index} className="text-gray-700">{fiera}</li>
                ))}
              </ul>
            </div>
          )}
          
          {espositore.images && espositore.images.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-wedding-dark">Galleria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {espositore.images.map((image, index) => (
                  <div key={index} className="rounded-md overflow-hidden aspect-video">
                    <img 
                      src={image} 
                      alt={`${espositore.name} - immagine ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-wedding-gold hover:bg-wedding-gold/90 text-white"
            >
              {isGeneratingPDF ? "Generazione PDF in corso..." : "Scarica Informazioni PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EspositoreModal;
