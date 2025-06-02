import { Component } from '@angular/core';
import { BoardsService, Board } from '../../services/board-service.service';
import { ListService } from '../../services/listservice.service';
import { CommonModule } from '@angular/common';


export interface List {
  _id: string;
  board: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [
    CommonModule,


  ],
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
})
export class BoardListComponent {
  boards: Board[] = [];
  loading = false;
  error: string | null = null;
  selectedBoardId: string = '';
  selectedListId: string = '';
  lists: List[] = [];

  constructor(
    private boardsService: BoardsService,
    private listService: ListService
  ) {
    this.fetchBoards();
  }

  fetchBoards(): void {
    this.loading = true;

    this.boardsService.getBoards().subscribe({
      next: (data) => {
        this.boards = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load boards';
        console.error(err);
        this.loading = false;
      },
    });
  }

  selectBoard(boardId: string): void {
    this.selectedBoardId = boardId;
    this.selectedListId = '';
    this.fetchLists(boardId);
  }

  fetchLists(boardId: string): void {
    this.listService.getLists(boardId).subscribe({
      next: (data) => {
        this.lists = data;
      },
      error: (err) => {
        console.error('Failed to load lists', err);
      },
    });
  }
}
