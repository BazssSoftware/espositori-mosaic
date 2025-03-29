
import { Espositore } from "../types/espositore";
import { jsPDF } from "jspdf";

// Funzione per convertire una URL immagine in data URL
const getImageAsDataURL = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return "";
  }
};

// Funzione per generare un PDF per un espositore
export const generatePDF = async (espositore: Espositore): Promise<string> => {
  // Crea un nuovo documento PDF
  const doc = new jsPDF();
  
  try {
    // Carica il logo di Sposi Oggi
    const sposiOggiLogoUrl = "/logo-sposi-oggi.png";
    const sposiOggiLogoDataUrl = await getImageAsDataURL(sposiOggiLogoUrl);
    
    // Aggiungi il logo di Sposi Oggi
    if (sposiOggiLogoDataUrl) {
      doc.addImage(sposiOggiLogoDataUrl, "PNG", 10, 10, 30, 30);
    }
    
    // Aggiungi il logo dell'espositore se disponibile
    if (espositore.logoUrl) {
      try {
        const espositoreLogoDataUrl = await getImageAsDataURL(espositore.logoUrl);
        if (espositoreLogoDataUrl) {
          doc.addImage(espositoreLogoDataUrl, "PNG", 160, 10, 30, 30);
        }
      } catch (e) {
        console.error("Errore nel caricamento del logo dell'espositore:", e);
      }
    }
    
    // Titolo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Espositore Sposi Oggi", 105, 50, { align: "center" });
    
    // Nome dell'espositore come sottotitolo
    doc.setFontSize(18);
    doc.text(espositore.name, 105, 60, { align: "center" });
    
    // Aggiungi linea separatrice
    doc.setDrawColor(233, 183, 206); // Colore rosa
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);
    
    // Aggiungi categoria se disponibile
    if (espositore.category) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(14);
      doc.text(espositore.category, 105, 72, { align: "center" });
    }
    
    // Aggiungi descrizione
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Descrizione:", 20, 85);
    
    // Formatta e aggiungi il testo della descrizione con ritorno a capo
    const descriptionLines = doc.splitTextToSize(espositore.description, 170);
    doc.text(descriptionLines, 20, 92);
    
    let yPosition = 92 + (descriptionLines.length * 7);
    
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
    
    if (espositore.fairLocation) {
      doc.text(`Posizione Fiera: ${espositore.fairLocation}`, 20, yPosition);
      yPosition += 15;
    }
    
    // Aggiungi sezione immagini se disponibili
    if (espositore.images && espositore.images.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Galleria Immagini", 20, yPosition);
      yPosition += 10;
      
      // Carica e aggiungi le immagini
      let imagesProcessed = 0;
      const maxImagesToProcess = Math.min(4, espositore.images.length); // Limita a 4 immagini
      
      for (let i = 0; i < maxImagesToProcess; i++) {
        try {
          const imageUrl = espositore.images[i];
          const imageDataUrl = await getImageAsDataURL(imageUrl);
          
          if (imageDataUrl) {
            // Calcola posizione per 2 immagini per riga
            const xPos = i % 2 === 0 ? 20 : 110;
            const yPos = yPosition + Math.floor(i / 2) * 60;
            
            doc.addImage(imageDataUrl, "JPEG", xPos, yPos, 80, 50);
            imagesProcessed++;
          }
        } catch (error) {
          console.error(`Errore nel caricamento dell'immagine ${i}:`, error);
        }
      }
      
      // Aggiorna la posizione Y dopo aver aggiunto le immagini
      if (imagesProcessed > 0) {
        yPosition += Math.ceil(imagesProcessed / 2) * 60 + 10;
      }
    }
    
    // Aggiungi footer con informazioni aziendali
    const footerYPos = 280;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Sposi Oggi - Un progetto di Events Srls", 105, footerYPos - 20, { align: "center" });
    doc.text("Via Montello 11 Treviso (TV)", 105, footerYPos - 15, { align: "center" });
    doc.text("P.IVA 05127530268 | marketing@onlyoumedia.it", 105, footerYPos - 10, { align: "center" });
    doc.text(`Generato il ${new Date().toLocaleDateString()}`, 105, footerYPos, { align: "center" });
    
  } catch (error) {
    console.error("Errore nella generazione del PDF:", error);
  }
  
  // Restituisci come data URL
  return doc.output('dataurlstring');
};
