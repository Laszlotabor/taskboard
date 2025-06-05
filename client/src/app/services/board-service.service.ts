import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Board {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  user: string;
}

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  private apiUrl = 'http://localhost:5000/api/boards';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getBoard(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createBoard(data: {
    title: string;
    description?: string;
  }): Observable<Board> {
    return this.http.post<Board>(this.apiUrl, data, {
      headers: this.getAuthHeaders(),
    });
  }

  updateBoard(id: string, data: Partial<Board>): Observable<Board> {
    return this.http.put<Board>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteBoard(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  inviteUserToBoard(boardId: string, email: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${boardId}/invite`,
      { email },
      { headers: this.getAuthHeaders() }
    );
  }
}
