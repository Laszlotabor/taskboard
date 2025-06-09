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

  // Added properties for image handling
  editedImageUrl: string | null = null;
  editedImageFile: File | null = null;

  constructor(private cardService: CardService) {}

  openModal() {
    this.editedTitle = this.card.title;
    this.editedDescription = this.card.description ?? '';
    this.editedImageUrl = this.card.imageUrl ?? null; // if you have imageUrl in Card model
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    // handle the file here — e.g., upload or read it

    // For example, you might want to upload the image and update the card:
    this.cardService.uploadImage(this.card._id!, file).subscribe({
      next: (updatedCard) => {
        this.card.imageUrl = updatedCard.imageUrl;
      },
      error: (err) => console.error('Image upload failed:', err),
    });
  }

  saveChanges() {
    const updates: Partial<Card> = {
      title: this.editedTitle,
      description: this.editedDescription,
    };

    // Optionally handle image upload/update here if needed

    this.cardService.updateCard(this.card._id!, updates).subscribe({
      next: (updatedCard) => {
        this.card.title = updatedCard.title;
        this.card.description = updatedCard.description;
        // Update imageUrl if it exists
        if (updatedCard.imageUrl) {
          this.card.imageUrl = updatedCard.imageUrl;
        }
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
