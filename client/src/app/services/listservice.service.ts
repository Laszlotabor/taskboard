import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { List } from '../models/list'; // adjust path if needed

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private apiUrl = 'http://localhost:5000/api/lists'; // Your backend API endpoint for lists

  constructor(private http: HttpClient) {}

  getLists(boardId: string): Observable<List[]> {
    return this.http.get<List[]>(`${this.apiUrl}/${boardId}`);
  }
  // Add this method:
  createList(boardId: string, title: string): Observable<List> {
    return this.http.post<List>(`${this.apiUrl}`, { board: boardId, title });
  }
}
