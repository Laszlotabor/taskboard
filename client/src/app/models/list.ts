
import { Card } from "./card";
export interface List {
  _id?: string;
  title: string;
  board?: string;
  position: number;
  cards?: Card[]; // 👈 Add this if not already present
}
  
