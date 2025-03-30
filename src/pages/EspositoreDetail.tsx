
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, MapPin, Calendar, Phone } from "lucide-react";
import { espositori } from '@/data/espositori';
import { Espositore } from '@/types/espositore';
import { generatePDF } from '@/utils/pdfGenerator';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fiere } from '@/data/fiere';
import { Badge } from "@/components/ui/badge";

const EspositoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [espositore, setEspositore] = useState<Espositore | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  useEffect(() => {
    const foundEspositore = espositori.find(e => e.id === id);
    
    if (foundEspositore) {
      setEspositore(foundEspositore);
      
      // Set page metadata for SEO
      document.title = `${foundEspositore.name} - Sposi Oggi`;
      
      // You could also set meta description for SEO
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', foundEspositore.description.substring(0, 160));
      }
    } else {
      navigate('/');
    }
  }, [id, navigate]);
  
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

  // Ottieni le fiere a cui partecipa l'espositore
  const getFiereEspositore = () => {
    if (!espositore?.fiere || espositore.fiere.length === 0) return [];
    
    return fiere.filter(fiera => 
      espositore.fiere?.includes(fiera.id)
    );
  };

  const fiereEspositore = getFiereEspositore();

  if (!espositore) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Espositore non trovato</h1>
            <Button onClick={() => navigate('/')}>Torna agli Espositori</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src="/logo-sposi-oggi.png" alt="Sposi Oggi Logo" />
                <AvatarFallback>SO</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold text-wedding-dark">Sposi Oggi</h2>
            </div>
            {espositore.logoUrl && (
              <div className="h-16 flex items-center justify-center">
                <img 
                  src={espositore.logoUrl} 
                  alt={`${espositore.name} logo`} 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold text-wedding-dark text-center">
              {espositore.name}
            </h1>
            
            {espositore.category && (
              <p className="text-lg text-muted-foreground mt-2">
                {espositore.category}
              </p>
            )}
          </div>
          
          <Separator className="my-6 bg-wedding-primary/30" />
          
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-wedding-dark">Descrizione</h2>
              <p className="text-gray-700 leading-relaxed">{espositore.description}</p>
            </div>
            
            {fiereEspositore.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-wedding-dark">Partecipa a</h2>
                <div className="flex flex-wrap gap-2">
                  {fiereEspositore.map(fiera => (
                    <Badge key={fiera.id} variant="outline" className="flex gap-1 items-center px-3 py-1">
                      <Calendar className="h-4 w-4 text-wedding-gold" />
                      <span>{fiera.nome} | {fiera.data}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {espositore.website && (
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-wedding-dark">Sito Web</h2>
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
                <h2 className="text-2xl font-semibold mb-3 text-wedding-dark">Contatti</h2>
                <a 
                  href={`tel:${espositore.phoneNumber.replace(/\s+/g, '')}`} 
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {espositore.phoneNumber}
                </a>
              </div>
            )}
            
            {espositore.fairLocation && (
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-wedding-dark">Posizione Fiera</h2>
                <p className="text-gray-700 flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-wedding-gold" />
                  {espositore.fairLocation}
                </p>
              </div>
            )}
            
            {espositore.images && espositore.images.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-wedding-dark">Galleria</h2>
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
            
            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-wedding-gold hover:bg-wedding-gold/90 text-white min-w-64"
              >
                {isGeneratingPDF ? "Generazione PDF in corso..." : "Scarica Informazioni PDF"}
              </Button>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="border-wedding-primary/50 hover:bg-wedding-primary/20"
              >
                Torna a Tutti gli Espositori
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EspositoreDetail;
