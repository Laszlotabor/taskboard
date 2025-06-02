import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Card {
  _id?: string;
  list: string;
  title: string;
  description?: string;
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private apiUrl = 'http://localhost:5000/api/cards';

  constructor(private http: HttpClient) {}

  getCards(listId: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/${listId}`);
  }

  createCard(card: Partial<Card>): Observable<Card> {
    return this.http.post<Card>(this.apiUrl, card);
  }

  updateCard(cardId: string, card: Partial<Card>): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${cardId}`, card);
  }

  deleteCard(cardId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${cardId}`);
  }

  moveCard(
    cardId: string,
    newListId: string,
    newPosition: number
  ): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/move/${cardId}`, {
      newListId,
      newPosition,
    });
  }
}
