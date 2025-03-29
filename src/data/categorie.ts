
import { Categoria } from "../types/categoria";
import { v4 as uuidv4 } from 'uuid';

export const categorie: Categoria[] = [
  { id: uuidv4(), nome: "Abbigliamento / Atelier" },
  { id: uuidv4(), nome: "Agenzie di viaggio" },
  { id: uuidv4(), nome: "Auto a noleggio" },
  { id: uuidv4(), nome: "Bomboniere" },
  { id: uuidv4(), nome: "Catering" },
  { id: uuidv4(), nome: "Celebrante" },
  { id: uuidv4(), nome: "Estetista" },
  { id: uuidv4(), nome: "Event planner" },
  { id: uuidv4(), nome: "Fioreria" },
  { id: uuidv4(), nome: "Foto o videomaker" },
  { id: uuidv4(), nome: "Intrattenimento, Musica o Comicità" },
  { id: uuidv4(), nome: "Location per matrimoni e ricevimenti" },
  { id: uuidv4(), nome: "Ristorante" },
  { id: uuidv4(), nome: "Parrucchiere o Hairstylist" },
  { id: uuidv4(), nome: "Trasporti" },
];

export const getOpzioniCategorie = () => {
  return categorie.map(categoria => ({
    value: categoria.id,
    label: categoria.nome
  }));
};
