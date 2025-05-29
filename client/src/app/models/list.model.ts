import { Card } from './card.model';


export interface List {
  _id: string;
  title: string;
  boardId: string;
  position: number;
  cards: Card[]; // Assuming you include cards in the list response
}
