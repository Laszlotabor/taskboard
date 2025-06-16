import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../models/card';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private baseUrl = `${environment.apiUrl}/cards`;

  constructor(private http: HttpClient) {}

  getCards(listId: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.baseUrl}/list/${listId}`);
  }

  /** 🔹 Create a new card */
  createCard(card: Partial<Card>): Observable<Card> {
    return this.http.post<Card>(this.baseUrl, card);
  }

  /** 🔹 Update a card */
  updateCard(id: string, updates: Partial<Card>): Observable<Card> {
    return this.http.put<Card>(`${this.baseUrl}/${id}`, updates);
  }

  /** 🔹 Delete a card */
  deleteCard(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  /** 🔹 Move a card to another list or position */
  moveCard(
    cardId: string,
    newListId: string,
    newPosition: number
  ): Observable<Card> {
    return this.http.put<Card>(`${this.baseUrl}/move/${cardId}`, {
      newListId,
      newPosition,
    });
  }
  uploadImage(cardId: string, imageFile: File): Observable<Card> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.put<Card>(`${this.baseUrl}/${cardId}`, formData);
  }
}
