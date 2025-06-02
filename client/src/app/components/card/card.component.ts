import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from '../../models/card';
import { CardService } from '../../services/card-service.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() card!: Card;
  @Output() cardDeleted = new EventEmitter<string>(); // Emit deleted card id

  isEditing = false;
  showModal = false;
  editedTitle: string = '';
  editedDescription: string = '';

  constructor(private cardService: CardService) {}

  openModal() {
    this.editedTitle = this.card.title;
    this.editedDescription = this.card.description ?? '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveChanges() {
    const updates = {
      title: this.editedTitle,
      description: this.editedDescription,
    };

    this.cardService.updateCard(this.card._id!, updates).subscribe({
      next: (updatedCard) => {
        this.card.title = updatedCard.title;
        this.card.description = updatedCard.description;
        this.closeModal();
      },
      error: (err) => console.error('Failed to update card:', err),
    });
  }

  deleteCard() {
    if (!this.card._id) return;

    this.cardService.deleteCard(this.card._id).subscribe({
      next: () => {
        this.cardDeleted.emit(this.card._id!); // Notify parent
        this.closeModal();
      },
      error: (err) => console.error('Failed to delete card:', err),
    });
  }
}
