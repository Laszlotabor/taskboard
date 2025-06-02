import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface List {
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
}
