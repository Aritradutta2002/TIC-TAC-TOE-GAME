import { Component, OnInit } from '@angular/core';
import { GameService, GameMode, Difficulty } from '../game.service';
import { ThemeService, Theme } from '../theme.service';
import { CommonModule } from '@angular/common';
import { SquareComponent } from '../square/square.component';
import { FormsModule } from '@angular/forms';
import { CelebrationPopupComponent } from '../celebration-popup/celebration-popup.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  standalone: true,
  imports: [CommonModule, SquareComponent, FormsModule, CelebrationPopupComponent]
})
export class BoardComponent implements OnInit {
  selectedGameMode: GameMode = 'friend';
  selectedDifficulty: Difficulty = 'moderate';
  playerXName: string = 'Player 1';
  playerOName: string = 'Player 2';
  aiName: string = 'AI Bot';
  selectedFirstPlayer: 'X' | 'O' = 'X';

  constructor(
    public gameService: GameService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.gameService.newGame();
    // Initialize names in game service
    this.updatePlayerNames();
    this.updateAIName();
  }

  onGameModeChange() {
    this.gameService.setGameMode(this.selectedGameMode);
  }

  onDifficultyChange() {
    this.gameService.setDifficulty(this.selectedDifficulty);
  }

  newGame() {
    this.gameService.newGame();
    this.gameService.startGame();
  }

  makeMove(idx: number) {
    this.gameService.makeMove(idx);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  getWinnerMessage(): string {
    if (this.gameService.winner === 'draw') {
      return "It's a Draw!";
    } else if (this.gameService.winner) {
      if (this.gameService.gameMode === 'ai') {
        return this.gameService.winner === this.gameService.humanPlayer ? 'You Win!' : 'AI Wins!';
      } else {
        return `Player ${this.gameService.winner} Wins!`;
      }
    }
    return '';
  }

  getCurrentPlayerMessage(): string {
    if (this.gameService.winner) return '';
    
    const currentPlayerName = this.gameService.getCurrentPlayerName();
    
    if (this.gameService.gameMode === 'ai') {
      return this.gameService.player === this.gameService.humanPlayer ? `${currentPlayerName}'s Turn` : `${this.gameService.aiName} Thinking...`;
    } else {
      return `${currentPlayerName}'s Turn`;
    }
  }

  updatePlayerNames() {
    this.gameService.setPlayerNames(this.playerXName, this.playerOName);
  }

  updateAIName() {
    this.gameService.setAIName(this.aiName);
  }

  closePopup() {
    this.gameService.winner = null;
  }

  onPopupNewGame() {
    this.newGame();
  }

  resetScores() {
    this.gameService.resetScores();
  }

  onFirstPlayerChange() {
    this.gameService.setFirstPlayer(this.selectedFirstPlayer);
    // If AI is selected to go first (O), trigger AI move automatically
    if (this.gameService.gameMode === 'ai' && this.selectedFirstPlayer === 'O') {
      setTimeout(() => {
        this.gameService.makeAIMove();
      }, 3000); // 3 second delay for "thinking"
    }
  }

  getFirstPlayerOptions() {
    if (this.gameService.gameMode === 'ai') {
      return [
        { value: 'X', label: `${this.playerXName} (You)` },
        { value: 'O', label: `${this.aiName} (AI)` }
      ];
    } else {
      return [
        { value: 'X', label: `${this.playerXName}` },
        { value: 'O', label: `${this.playerOName}` }
      ];
    }
  }
}