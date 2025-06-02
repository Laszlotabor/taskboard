import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../models/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class CardComponent {
  @Input() card!: Card;
  @Output() update = new EventEmitter<Card>();
  @Output() delete = new EventEmitter<string>();

  editing = false;
  showModal = false;

  editedTitle: string = '';
  editedDescription: string = '';

  openModal(): void {
    this.editedTitle = this.card.title || '';
    this.editedDescription = this.card.description || ''; // <-- Fixes the error
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveChanges(): void {
    this.card.title = this.editedTitle;
    this.card.description = this.editedDescription;
    this.update.emit(this.card);
    this.closeModal();
  }

  deleteCard(): void {
    this.delete.emit(this.card._id!);
    this.closeModal();
  }
}
