import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface List {
  cards: any;
createdAt: string|number|Date;
  _id?: string;
  board: string;
  title: string;
  position: number;
}

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private baseUrl = 'http://localhost:5000/api/lists';

  constructor(private http: HttpClient) {}

  createList(list: Partial<List>): Observable<List> {
    return this.http.post<List>(this.baseUrl, list);
  }

  // This is the method you're using in BoardListComponent
  getLists(boardId: string): Observable<List[]> {
    return this.http.get<List[]>(`${this.baseUrl}/board/${boardId}`);
  }
  updateList(id: string, updates: Partial<List>): Observable<List> {
    return this.http.put<List>(`${this.baseUrl}/${id}`, updates);
  }
  // listservice.service.ts
  deleteList(listId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${listId}`);
  }
}
