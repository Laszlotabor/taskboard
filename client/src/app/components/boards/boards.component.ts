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



@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, DragDropModule],
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

  cards: { [listId: string]: Card[] } = {}; // Store cards per list

  constructor(
    private boardsService: BoardsService,
    private listService: ListService,
    private cardService: CardService
  ) {
    this.fetchBoards();
  }
  get connectedListIds(): string[] {
    return this.lists
      .map((l) => l._id!)
      .filter((id): id is string => typeof id === 'string');
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
        this.cards[createdList._id!] = [];
      },
      error: (err) => {
        console.error('Failed to create list', err);
      },
    });
  }

  startEditing(list: List): void {
    this.editingListId = list._id ?? null;
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
        delete this.cards[listId];
      },
      error: (err) => {
        console.error('Failed to delete list', err);
      },
    });
  }

  /** 💡 Load cards for a specific list */
  fetchCards(listId: string): void {
    this.cardService.getCards(listId).subscribe({
      next: (cards) => {
        this.cards[listId] = cards;
      },
      error: (err) => {
        console.error('Failed to load cards for list ' + listId, err);
      },
    });
  }

  /** ➕ Add a new card to a list */
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
          targetList.cards.push(createdCard); // ✅ Add card to the correct list
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
        this.cards[listId] = this.cards[listId].filter((c) => c._id !== cardId);
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
    const previousListId = event.previousContainer.id;
    const currentListId = event.container.id;

    if (event.previousContainer === event.container) {
      // Move within same list
      moveItemInArray(
        targetList.cards!,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const sourceList = this.lists.find((l) => l._id === previousListId);
      if (!sourceList) return;

      transferArrayItem(
        sourceList.cards!,
        targetList.cards!,
        event.previousIndex,
        event.currentIndex
      );

      const movedCard = targetList.cards![event.currentIndex];
      movedCard.list = targetList._id!; // Update card's list ID

      // Optional: persist changes to server
      this.cardService.updateCard(movedCard._id!, movedCard).subscribe({
        next: () => console.log('Card updated after moving between lists'),
        error: (err) => console.error('Failed to update card', err),
      });
    }
  }
}
