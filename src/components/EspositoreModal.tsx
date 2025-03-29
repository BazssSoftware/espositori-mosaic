
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
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
        title: "PDF Generated",
        description: "The exhibitor information PDF has been downloaded.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
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
            <img 
              src={espositore.logoUrl} 
              alt={`${espositore.name} logo`} 
              className="max-h-20 max-w-full object-contain"
            />
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
            <h3 className="text-xl font-semibold mb-2 text-wedding-dark">Description</h3>
            <p className="text-gray-700">{espositore.description}</p>
          </div>
          
          {espositore.website && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-wedding-dark">Website</h3>
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
          
          {espositore.fairLocation && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-wedding-dark">Fair Location</h3>
              <p className="text-gray-700">{espositore.fairLocation}</p>
            </div>
          )}
          
          {espositore.images && espositore.images.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-wedding-dark">Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {espositore.images.map((image, index) => (
                  <div key={index} className="rounded-md overflow-hidden aspect-video">
                    <img 
                      src={image} 
                      alt={`${espositore.name} - image ${index + 1}`} 
                      className="w-full h-full object-cover"
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
              {isGeneratingPDF ? "Generating PDF..." : "Download Information PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EspositoreModal;
