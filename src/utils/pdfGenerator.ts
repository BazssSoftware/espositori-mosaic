
import { Espositore } from "../types/espositore";
import { jsPDF } from "jspdf";

// Function to generate a PDF for an exhibitor
export const generatePDF = async (espositore: Espositore): Promise<string> => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add Sposi Oggi logo
  // doc.addImage("SPOSI_OGGI_LOGO_BASE64", "PNG", 10, 10, 40, 20);
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Sposi Oggi Exhibitor", 105, 20, { align: "center" });
  
  // Exhibitor name as subtitle
  doc.setFontSize(18);
  doc.text(espositore.name, 105, 30, { align: "center" });
  
  // Add separator line
  doc.setDrawColor(233, 183, 206); // Pink color
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Add description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Description:", 20, 45);
  
  // Format and add the description text with word wrapping
  const descriptionLines = doc.splitTextToSize(espositore.description, 170);
  doc.text(descriptionLines, 20, 55);
  
  let yPosition = 55 + (descriptionLines.length * 7);
  
  // Add contact information
  doc.setFont("helvetica", "bold");
  doc.text("Contact Information", 20, yPosition);
  yPosition += 10;
  
  doc.setFont("helvetica", "normal");
  if (espositore.website) {
    doc.text(`Website: ${espositore.website}`, 20, yPosition);
    yPosition += 7;
  }
  
  if (espositore.phoneNumber) {
    doc.text(`Phone: ${espositore.phoneNumber}`, 20, yPosition);
    yPosition += 7;
  }
  
  if (espositore.fairLocation) {
    doc.text(`Fair Location: ${espositore.fairLocation}`, 20, yPosition);
    yPosition += 7;
  }
  
  if (espositore.category) {
    doc.text(`Category: ${espositore.category}`, 20, yPosition);
    yPosition += 15;
  }
  
  // Add images section title
  doc.setFont("helvetica", "bold");
  doc.text("Gallery", 20, yPosition);
  yPosition += 10;
  
  // Add images (this would need to be implemented when we have actual image URLs)
  // Code here would iterate through espositore.images and place them in the PDF
  
  // Add footer with date
  const today = new Date();
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${today.toLocaleDateString()}`, 105, 280, { align: "center" });
  
  // Return as data URL
  return doc.output('dataurlstring');
};
