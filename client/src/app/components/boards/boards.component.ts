import { Component } from '@angular/core';
import { BoardsService, Board } from '../../services/board-service.service';
import { ListService} from '../../services/listservice.service';
import { CommonModule } from '@angular/common';
import { List } from '../../services/listservice.service';





@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CommonModule],
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
        console.log('Lists fetched:', data);
      },
      error: (err) => {
        console.error('Failed to load lists', err);
      },
    });
  }

  createList(boardId: string): void {
    const title = prompt('Enter list title:');
    if (!title || !title.trim()) return;

    const newList = {
      board: boardId,
      title: title.trim(),
      position: this.lists.length,
    };

    this.listService.createList(newList).subscribe({
      next: (list) => {
        this.lists.push(list);
      },
      error: (err) => {
        console.error('Failed to create list', err);
        alert('Error creating list');
      },
    });
  }
}
