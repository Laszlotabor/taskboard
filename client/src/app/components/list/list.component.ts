import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Card } from '../../models/card.model';
import { List } from '../../models/list.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, DragDropModule, CardComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent {
  @Output() cardDropped = new EventEmitter<CdkDragDrop<Card[]>>();

  @Input() list!: List;
  @Input() cards: Card[] = [];

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

    this.cardDropped.emit(event); // Notify parent component
  }
}
