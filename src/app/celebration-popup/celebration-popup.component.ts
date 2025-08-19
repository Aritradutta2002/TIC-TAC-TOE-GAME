import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-celebration-popup',
  templateUrl: './celebration-popup.component.html',
  styleUrls: ['./celebration-popup.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CelebrationPopupComponent {
  @Input() isVisible: boolean = false;
  @Input() winner: string | null = null;
  @Input() gameMode: string = 'friend';
  @Output() onClose = new EventEmitter<void>();
  @Output() onNewGame = new EventEmitter<void>();

  @Input() winnerName: string = '';

  getWinnerMessage(): string {
    if (this.winner === 'draw') {
      return "It's a Draw!";
    } else if (this.winner && this.winnerName) {
      if (this.gameMode === 'ai') {
        return this.winner === 'X' ? `🎉 ${this.winnerName} Wins! 🎉` : `🤖 ${this.winnerName} Wins! 🤖`;
      } else {
        return `🏆 ${this.winnerName} Wins! 🏆`;
      }
    }
    return '';
  }

  getWinnerSubtitle(): string {
    if (this.winner === 'draw') {
      return "Great game! Try again?";
    } else if (this.winner && this.winnerName) {
      if (this.gameMode === 'ai') {
        return this.winner === 'X' ? `Congratulations ${this.winnerName}! You beat the AI!` : `${this.winnerName} wins this round!`;
      } else {
        return `Congratulations ${this.winnerName} on your victory!`;
      }
    }
    return '';
  }

  closePopup() {
    this.onClose.emit();
  }

  startNewGame() {
    this.onNewGame.emit();
    this.closePopup();
  }
}
