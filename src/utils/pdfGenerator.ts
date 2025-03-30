
import { Espositore } from "@/types/espositore";
import { jsPDF } from "jspdf";

// Funzione per convertire una URL immagine in data URL
const getImageAsDataURL = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Errore nel caricamento dell'immagine: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (e) => {
        console.error("Errore nella lettura dell'immagine:", e);
        reject(e);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Errore nel recupero dell'immagine:", error);
    return null;
  }
};

// Funzione per verificare validità dell'immagine
const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch (error) {
    console.error(`Errore nella verifica dell'immagine ${url}:`, error);
    return false;
  }
};

// Funzione per generare un PDF per un espositore
export const generatePDF = async (espositore: Espositore): Promise<string> => {
  // Crea un nuovo documento PDF
  const doc = new jsPDF();
  
  try {
    let yPosition = 20;
    
    // Aggiungi il logo Sposi Oggi in alto
    try {
      const logoUrl = "/logo-sposi-oggi.png";
      doc.addImage(logoUrl, "PNG", 105 - 30, yPosition, 60, 30, undefined, 'FAST');
      yPosition += 40;
    } catch (e) {
      console.error("Errore nel caricamento del logo Sposi Oggi:", e);
      // Continua senza il logo
      yPosition += 10;
    }
    
    // Titolo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Scheda espositore Sposi Oggi", 105, yPosition, { align: "center" });
    yPosition += 15;
    
    // Nome dell'espositore come sottotitolo
    doc.setFontSize(18);
    doc.text(espositore.name, 105, yPosition, { align: "center" });
    yPosition += 10;
    
    // Aggiungi linea separatrice
    doc.setDrawColor(233, 183, 206); // Colore rosa
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    // Aggiungi logo dell'espositore se disponibile
    if (espositore.logoUrl) {
      const isValidLogo = await isValidImageUrl(espositore.logoUrl);
      if (isValidLogo) {
        try {
          const logoDataUrl = await getImageAsDataURL(espositore.logoUrl);
          if (logoDataUrl) {
            doc.addImage(logoDataUrl, "AUTO", 105 - 30, yPosition, 60, 40, undefined, 'FAST');
            yPosition += 50;
          }
        } catch (e) {
          console.error("Errore nell'elaborazione del logo:", e);
          // Continua senza il logo
        }
      }
    }
    
    // Aggiungi categoria se disponibile
    if (espositore.category) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(14);
      doc.text(espositore.category, 105, yPosition, { align: "center" });
      yPosition += 10;
    }
    
    // Aggiungi descrizione
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Descrizione:", 20, yPosition);
    yPosition += 7;
    
    // Formatta e aggiungi il testo della descrizione con ritorno a capo
    const descriptionLines = doc.splitTextToSize(espositore.description, 170);
    doc.text(descriptionLines, 20, yPosition);
    yPosition += (descriptionLines.length * 7) + 10;
    
    // Aggiungi informazioni di contatto
    doc.setFont("helvetica", "bold");
    doc.text("Informazioni di Contatto", 20, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    if (espositore.website) {
      doc.text(`Sito Web: ${espositore.website}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (espositore.phoneNumber) {
      doc.text(`Telefono: ${espositore.phoneNumber}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (espositore.email) {
      doc.text(`Email: ${espositore.email}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (espositore.fairLocation) {
      doc.text(`Posizione Fiera: ${espositore.fairLocation}`, 20, yPosition);
      yPosition += 10;
    }
    
    // Aggiungi informazioni sulle fiere a cui partecipa
    if (espositore.fiere && espositore.fiere.length > 0) {
      yPosition += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Partecipa alle Fiere:", 20, yPosition);
      yPosition += 7;
      
      doc.setFont("helvetica", "normal");
      espositore.fiere.forEach(fiera => {
        doc.text(`• ${fiera}`, 25, yPosition);
        yPosition += 7;
      });
      yPosition += 3;
    }
    
    // Aggiungi sezione immagini se disponibili
    if (espositore.images && espositore.images.length > 0) {
      yPosition += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Galleria Immagini", 20, yPosition);
      yPosition += 10;
      
      // Carica e aggiungi le immagini
      let imagesAdded = 0;
      const maxImagesToProcess = Math.min(2, espositore.images.length); // Limita a 2 immagini per evitare problemi
      
      for (let i = 0; i < maxImagesToProcess; i++) {
        try {
          const imageUrl = espositore.images[i];
          const isValid = await isValidImageUrl(imageUrl);
          
          if (isValid) {
            const imageDataUrl = await getImageAsDataURL(imageUrl);
            if (imageDataUrl) {
              // Usa sempre una sola immagine per riga per semplicità
              doc.addImage(imageDataUrl, "AUTO", 20, yPosition, 170, 90, undefined, 'FAST');
              yPosition += 100;
              imagesAdded++;
            }
          }
        } catch (error) {
          console.error(`Errore nel caricamento dell'immagine ${i}:`, error);
          // Continua con la prossima immagine
        }
      }
    }
    
    // Rimosso il footer come richiesto
    
  } catch (error) {
    console.error("Errore nella generazione del PDF:", error);
    throw new Error("Impossibile generare il PDF: " + error.message);
  }
  
  // Restituisci come data URL
  return doc.output('dataurlstring');
};
