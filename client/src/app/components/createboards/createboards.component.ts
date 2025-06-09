import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardsService } from '../../services/board-service.service';

@Component({
  selector: 'app-create-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './createboards.component.html',
  styleUrls: ['./createboards.component.css'],
})
export class CreateBoardComponent {
  title = '';
  description = '';
  loading = false;
  error: string | null = null;

  constructor(private boardsService: BoardsService, private router: Router) {}

  createBoard(): void {
    if (!this.title.trim()) {
      this.error = 'Title is required';
      return;
    }

    this.loading = true;
    this.error = null;

    this.boardsService
      .createBoard({ title: this.title, description: this.description })
      .subscribe({
        next: (board) => {
          this.loading = false;
          this.router.navigate(['/boards']); // Redirect to boards list after creation
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to create board. Please try again.';
          console.error(err);
        },
      });
  }
  backToBoards() {
    this.router.navigate(['/boards']);
   };
}
