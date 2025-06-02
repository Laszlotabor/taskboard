import { Component } from '@angular/core';
import { BoardsService, Board } from '../../services/board-service.service';
import { ListService} from '../../services/listservice.service';
import { CommonModule } from '@angular/common';
import { List } from '../../services/listservice.service';
import { FormsModule } from '@angular/forms';






@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  editingListId: string | null = null;

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
  getSelectedBoard(): Board | undefined {
    return this.boards.find((b) => b._id === this.selectedBoardId);
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
    const newList = {
      title: 'New List',
      position: this.lists.length,
      board: boardId,
    };

    this.listService.createList(newList).subscribe({
      next: (createdList) => {
        this.lists.push(createdList);
      },
      error: (err) => {
        console.error('Failed to create list', err);
      },
    });
  }
  startEditing(list: List): void {
    this.editingListId = list._id ?? null; // Use null if _id is undefined
  }

  cancelEditing(): void {
    this.editingListId = null;
  }

  saveList(list: List): void {
    this.listService.updateList(list._id!, { title: list.title }).subscribe({
      next: (updated) => {
        this.editingListId = null;
        // Optionally, refresh lists again
      },
      error: (err) => {
        console.error('Failed to update list', err);
      },
    });
  }
}
