import { Component } from '@angular/core';
import { BoardsService, Board } from '../../services/board-service.service';
import { ListService, List } from '../../services/listservice.service';
import { Card } from '../../models/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService } from '../../services/card-service.service';
import { CardComponent } from '../card/card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AuthService } from '../../services/auth-service.service';
import { User } from '../../models/user';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    DragDropModule,
    RouterLink,
  ],
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
})
export class BoardListComponent {
  user: User | null = null;
  boards: Board[] = [];
  loading = false;
  error: string | null = null;

  selectedBoardId = '';
  selectedListId = '';
  lists: List[] = [];

  editingListId: string | null = null;

  inviteEmail = '';
  inviteMessage: string | null = null;
  inviteError: string | null = null;

  // Track the ID of the list with an open menu
  listMenuOpenId: string | null = null;

  constructor(
    private boardsService: BoardsService,
    private listService: ListService,
    private cardService: CardService,
    private authService: AuthService // <-- Inject here
  ) {
    console.log('User from AuthService:', this.user);

    this.user = this.authService.getUser();
    this.fetchBoards();
  }

  get connectedListIds(): string[] {
    return this.lists.map((l) => l._id!).filter((id) => !!id);
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
    this.listMenuOpenId = null; // Close any open menu on board change
  }

  getSelectedBoard(): Board | undefined {
    return this.boards.find((b) => b._id === this.selectedBoardId);
  }

  deleteBoard(boardId: string): void {
    if (!boardId) return;

    if (confirm('Are you sure you want to delete this board?')) {
      this.boardsService.deleteBoard(boardId).subscribe({
        next: () => {
          this.boards = this.boards.filter((b) => b._id !== boardId);

          if (this.selectedBoardId === boardId) {
            this.selectedBoardId = '';
            this.lists = [];
          }
        },
        error: (err) => {
          console.error('Failed to delete board', err);
          this.error = 'Failed to delete board';
        },
      });
    }
  }

  updateBoard(boardId: string): void {
    const board = this.boards.find((b) => b._id === boardId);
    if (!board) return;

    const newTitle = prompt('Enter new board title:', board.title);
    if (newTitle === null || newTitle.trim() === '') return;

    const newDescription =
      prompt('Enter new description:', board.description || '') || '';

    this.boardsService
      .updateBoard(boardId, {
        title: newTitle.trim(),
        description: newDescription.trim(),
      })
      .subscribe({
        next: (updatedBoard) => {
          const index = this.boards.findIndex((b) => b._id === boardId);
          if (index !== -1) this.boards[index] = updatedBoard;

          if (this.selectedBoardId === boardId) this.selectBoard(boardId);
        },
        error: (err) => {
          console.error('Failed to update board', err);
          this.error = 'Failed to update board';
        },
      });
  }

  fetchLists(boardId: string): void {
    this.listService.getLists(boardId).subscribe({
      next: (lists) => {
        this.lists = lists;
        for (const list of this.lists) {
          this.cardService.getCards(list._id!).subscribe({
            next: (cards) => {
              list.cards = cards;
            },
            error: (err) => console.error('Failed to fetch cards', err),
          });
        }
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
    this.editingListId = list._id ?? null;
    this.listMenuOpenId = null; // close menu when editing starts
  }

  cancelEditing(): void {
    this.editingListId = null;
  }

  saveList(list: List): void {
    if (!list._id) return;
    this.listService.updateList(list._id, { title: list.title }).subscribe({
      next: () => {
        this.editingListId = null;
      },
      error: (err) => {
        console.error('Failed to update list', err);
      },
    });
  }

  deleteList(listId: string): void {
    this.listService.deleteList(listId).subscribe({
      next: () => {
        this.lists = this.lists.filter((list) => list._id !== listId);
      },
      error: (err) => {
        console.error('Failed to delete list', err);
      },
    });
  }

  addCard(listId: string): void {
    const newCard = {
      title: 'New Card',
      description: '',
      position: 0,
      list: listId,
    };

    this.cardService.createCard(newCard).subscribe({
      next: (createdCard) => {
        const targetList = this.lists.find((list) => list._id === listId);
        if (targetList) {
          if (!targetList.cards) targetList.cards = [];
          targetList.cards.push(createdCard);
        }
      },
      error: (err) => {
        console.error('Failed to create card', err);
      },
    });
  }

  updateCard(card: Card): void {
    this.cardService.updateCard(card._id!, card).subscribe({
      next: () => console.log('Card updated'),
      error: (err) => console.error('Failed to update card', err),
    });
  }

  deleteCard(listId: string, cardId: string): void {
    this.cardService.deleteCard(cardId).subscribe({
      next: () => {
        const targetList = this.lists.find((list) => list._id === listId);
        if (targetList && targetList.cards) {
          targetList.cards = targetList.cards.filter(
            (c: { _id: string }) => c._id !== cardId
          );
        }
      },
      error: (err) => console.error('Failed to delete card', err),
    });
  }

  onCardDeleted(cardId: string, list: List): void {
    if (list.cards) {
      list.cards = list.cards.filter((card: Card) => card._id !== cardId);
    }
  }

  dropCard(event: CdkDragDrop<Card[]>, targetList: List): void {
    if (!targetList.cards) targetList.cards = [];

    if (event.previousContainer === event.container) {
      moveItemInArray(
        targetList.cards,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const sourceList = this.lists.find(
        (l) => l._id === event.previousContainer.id
      );
      if (!sourceList || !sourceList.cards) return;

      transferArrayItem(
        sourceList.cards,
        targetList.cards,
        event.previousIndex,
        event.currentIndex
      );

      const movedCard = targetList.cards[event.currentIndex];
      movedCard.list = targetList._id!;

      this.cardService.updateCard(movedCard._id!, movedCard).subscribe({
        next: () => console.log('Card updated after moving between lists'),
        error: (err) => console.error('Failed to update card', err),
      });
    }
  }

  inviteUser(): void {
    if (!this.inviteEmail || !this.selectedBoardId) {
      this.inviteError = 'Please enter a valid email!!!';
      return;
    }

    this.boardsService
      .inviteUserToBoard(this.selectedBoardId, this.inviteEmail)
      .subscribe({
        next: () => {
          this.inviteMessage = 'User invited successfully!!!';
          this.inviteError = null;
          this.inviteEmail = '';
        },
        error: (err) => {
          console.error('Invitation failed!!!', err);
          this.inviteError = err?.error?.message || 'Failed to invite user!!!';
          this.inviteMessage = null;
        },
      });
  }

  toggleListMenu(listId: string): void {
    this.listMenuOpenId = this.listMenuOpenId === listId ? null : listId;
  }

  uploadImage(list: any) {
    console.log('Upload image for', list.title);
    // Your file upload logic here
  }
}
