
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import { espositori } from '@/data/espositori';
import { Espositore } from '@/types/espositore';
import { generatePDF } from '@/utils/pdfGenerator';
import { useToast } from '@/components/ui/use-toast';

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

  if (!espositore) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Exhibitor not found</h1>
            <Button onClick={() => navigate('/')}>Return to Exhibitors</Button>
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
          <div className="flex flex-col items-center mb-6">
            <div className="h-32 flex items-center justify-center mb-4">
              <img 
                src={espositore.logoUrl} 
                alt={`${espositore.name} logo`} 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
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
              <h2 className="text-2xl font-semibold mb-3 text-wedding-dark">Description</h2>
              <p className="text-gray-700 leading-relaxed">{espositore.description}</p>
            </div>
            
            {espositore.website && (
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-wedding-dark">Website</h2>
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
                <h2 className="text-2xl font-semibold mb-3 text-wedding-dark">Contact</h2>
                <p className="text-gray-700">{espositore.phoneNumber}</p>
              </div>
            )}
            
            {espositore.fairLocation && (
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-wedding-dark">Fair Location</h2>
                <p className="text-gray-700">{espositore.fairLocation}</p>
              </div>
            )}
            
            {espositore.images && espositore.images.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-wedding-dark">Gallery</h2>
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
            
            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-wedding-gold hover:bg-wedding-gold/90 text-white min-w-64"
              >
                {isGeneratingPDF ? "Generating PDF..." : "Download Information PDF"}
              </Button>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="border-wedding-primary/50 hover:bg-wedding-primary/20"
              >
                Back to All Exhibitors
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
