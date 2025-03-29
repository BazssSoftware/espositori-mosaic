
import { Fiera } from "../types/fiera";
import { v4 as uuidv4 } from 'uuid';

export const fiere: Fiera[] = [
  { id: uuidv4(), nome: "Fiera Sposi Oggi Belluno", data: "21 e 22 settembre 2025" },
  { id: uuidv4(), nome: "Fiera Sposi Oggi Bologna", data: "27 e 28 settembre 2025" },
  { id: uuidv4(), nome: "Fiera Sposi Oggi Verona", data: "4 e 5 ottobre 2025" },
  { id: uuidv4(), nome: "Fiera Sposi Oggi Padova", data: "11 e 12 ottobre 2025" },
  { id: uuidv4(), nome: "Fiera Sposi Oggi Forlì-Cesena", data: "25 e 26 ottobre 2025" },
  { id: uuidv4(), nome: "Fiera Sposi Oggi Treviso", data: "15 e 16 novembre 2025" },
  { id: uuidv4(), nome: "Fiera Sposi Oggi Bergamo", data: "22 e 23 novembre 2025" },
  { id: uuidv4(), nome: "Fiera Sposi Oggi Modena", data: "10 e 11 gennaio 2025" },
  { id: uuidv4(), nome: "Fiera Sposi Oggi Vicenza", data: "17 e 18 gennaio 2025" },
  { id: uuidv4(), nome: "Fiera Sposi Oggi Mantova", data: "24 e 25 gennaio 2025" },
];

export const getOpzioniFiere = () => {
  return fiere.map(fiera => ({
    value: fiera.id,
    label: `${fiera.nome} | ${fiera.data}`
  }));
};
