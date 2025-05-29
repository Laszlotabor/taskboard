export interface Card {
  _id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  // Add any other fields returned from the backend
}
