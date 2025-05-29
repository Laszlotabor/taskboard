import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from '../list/list.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Card } from '../../models/card.model';
import { List } from '../../models/list.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, ListComponent],
  styleUrls: ['./board.component.css'],
  template: `
    <div class="board" cdkDropListGroup>
      <app-list
        *ngFor="let list of lists"
        [list]="list"
        (cardDropped)="drop($event)"
      ></app-list>
    </div>
  `,
})
export class BoardComponent {
  lists: List[] = [
    {
      _id: 'list1',
      boardId: 'board1',
      title: 'To Do',
      position: 1,
      cards: [
        { _id: 'card1', title: 'Task 1', listId: 'list1', position: 1 },
        { _id: 'card2', title: 'Task 2', listId: 'list1', position: 2 },
      ],
    },
    {
      _id: 'list2',
      boardId: 'board1',
      title: 'In Progress',
      position: 2,
      cards: [{ _id: 'card3', title: 'Task 3', listId: 'list2', position: 1 }],
    },
  ];

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    console.log('Dropped card:', event.item.data);
    // Optionally: call backend sync here
  }
}
