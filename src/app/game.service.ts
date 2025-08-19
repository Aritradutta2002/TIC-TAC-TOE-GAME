import { Injectable } from '@angular/core';

export type GameMode = 'friend' | 'ai';
export type Difficulty = 'easy' | 'moderate' | 'expert';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public squares: any[] = [];
  public player: 'X' | 'O' = 'X';
  public winner: string | null = null;
  public gameMode: GameMode = 'friend';
  public difficulty: Difficulty = 'moderate';
  public humanPlayer: 'X' | 'O' = 'X';
  public aiPlayer: 'X' | 'O' = 'O';
  public playerXName: string = 'Player 1';
  public playerOName: string = 'Player 2';
  public aiName: string = 'AI Bot';
  public playerXScore: number = 0;
  public playerOScore: number = 0;
  public drawScore: number = 0;
  public firstPlayer: 'X' | 'O' = 'X';

  constructor() {
    this.newGame();
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.player = this.firstPlayer;
    this.winner = null;
  }

  startGame() {
    // Only trigger AI move if it's truly AI's turn and board is empty
    if (this.gameMode === 'ai' && this.player === this.aiPlayer && !this.winner && this.squares.every(square => square === null)) {
      setTimeout(() => this.makeAIMove(), 500);
    }
  }

  setGameMode(mode: GameMode) {
    this.gameMode = mode;
    this.newGame();
  }

  setDifficulty(difficulty: Difficulty) {
    this.difficulty = difficulty;
  }

  setFirstPlayer(player: 'X' | 'O') {
    this.firstPlayer = player;
    // In AI mode, human is always X, AI is always O
    if (this.gameMode === 'ai') {
      this.humanPlayer = 'X';
      this.aiPlayer = 'O';
    }
    this.newGame();
  }

  setPlayerNames(playerXName: string, playerOName: string) {
    this.playerXName = playerXName || 'Player 1';
    this.playerOName = playerOName || 'Player 2';
  }

  setAIName(aiName: string) {
    this.aiName = aiName || 'AI Bot';
  }

  getCurrentPlayerName(): string {
    if (this.gameMode === 'ai') {
      return this.player === this.humanPlayer ? this.playerXName : this.aiName;
    } else {
      return this.player === 'X' ? this.playerXName : this.playerOName;
    }
  }

  getWinnerName(): string {
    if (this.winner === 'draw') return 'draw';
    if (!this.winner) return '';
    
    if (this.gameMode === 'ai') {
      return this.winner === this.humanPlayer ? this.playerXName : this.aiName;
    } else {
      return this.winner === 'X' ? this.playerXName : this.playerOName;
    }
  }

  updateScore() {
    if (this.winner === 'draw') {
      this.drawScore++;
    } else if (this.winner === 'X') {
      this.playerXScore++;
    } else if (this.winner === 'O') {
      this.playerOScore++;
    }
  }

  resetScores() {
    this.playerXScore = 0;
    this.playerOScore = 0;
    this.drawScore = 0;
  }

  getPlayerXDisplayName(): string {
    return this.gameMode === 'ai' ? this.playerXName : this.playerXName;
  }

  getPlayerODisplayName(): string {
    return this.gameMode === 'ai' ? this.aiName : this.playerOName;
  }

  makeMove(idx: number) {
    if (this.winner || this.squares[idx]) {
      return;
    }

    this.squares.splice(idx, 1, this.player);
    this.winner = this.calculateWinner();

    if (!this.winner && this.squares.every(square => square !== null)) {
      this.winner = 'draw';
      this.updateScore();
      return;
    }

    if (!this.winner) {
      this.player = this.player === 'X' ? 'O' : 'X';
      
      // If AI mode and it's AI's turn, make AI move
      if (this.gameMode === 'ai' && this.player === this.aiPlayer) {
        setTimeout(() => this.makeAIMove(), 500);
      }
    } else {
      this.updateScore();
    }
  }

  makeAIMove() {
    if (this.winner) return;

    const bestMove = this.getBestMove();
    
    if (bestMove !== -1) {
      this.squares.splice(bestMove, 1, this.aiPlayer);
      this.winner = this.calculateWinner();
      
      if (!this.winner && this.squares.every(square => square !== null)) {
        this.winner = 'draw';
        this.updateScore();
      } else if (!this.winner) {
        this.player = this.humanPlayer;
      } else {
        this.updateScore();
      }
    }
  }

  getBestMove(): number {
    const availableSpaces = this.squares.map((square, index) => square === null ? index : null).filter(val => val !== null);
    
    if (availableSpaces.length === 0) return -1;
    // If board is empty (AI to play first), pick an opening move based on difficulty
    if (availableSpaces.length === 9) {
      return this.getOpeningMoveByDifficulty();
    }

    switch (this.difficulty) {
      case 'easy':
        return this.getEasyMove(availableSpaces);
      case 'moderate':
        return this.getModerateMove(availableSpaces);
      case 'expert':
        return this.getExpertMove(availableSpaces);
      default:
        return this.getModerateMove(availableSpaces);
    }
  }

  private getEasyMove(availableSpaces: number[]): number {
    // Easy: 70% random moves, 30% strategic
    if (Math.random() < 0.7) {
      return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
    }
    return this.getStrategicMove(availableSpaces);
  }

  private getModerateMove(availableSpaces: number[]): number {
    // Moderate: 40% random, 60% strategic
    if (Math.random() < 0.4) {
      return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
    }
    return this.getStrategicMove(availableSpaces);
  }

  private getExpertMove(availableSpaces: number[]): number {
    // Expert: Always strategic with minimax algorithm
  return this.getMinimaxMove();
  }

  private getStrategicMove(availableSpaces: number[]): number {
    // Try to win
    for (let i of availableSpaces) {
      this.squares[i] = this.aiPlayer;
      if (this.calculateWinner() === this.aiPlayer) {
        this.squares[i] = null;
        return i;
      }
      this.squares[i] = null;
    }

    // Block human from winning
    for (let i of availableSpaces) {
      this.squares[i] = this.humanPlayer;
      if (this.calculateWinner() === this.humanPlayer) {
        this.squares[i] = null;
        return i;
      }
      this.squares[i] = null;
    }

    // Take center if available
    if (availableSpaces.includes(4)) {
      return 4;
    }

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => availableSpaces.includes(i));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  }

  private getMinimaxMove(): number {
    let bestScore = -Infinity;
    let bestMoves: number[] = [];

    for (let i = 0; i < 9; i++) {
      if (!this.squares[i]) {
        this.squares[i] = this.aiPlayer;
        const score = this.minimax(this.squares, 0, false);
        this.squares[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMoves = [i];
        } else if (score === bestScore) {
          bestMoves.push(i);
        }
      }
    }

    if (bestMoves.length === 0) return -1;
    // Randomize among equally good minimax moves to reduce predictability
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  // Choose an opening move depending on difficulty but introduce randomness so AI doesn't
  // always open in the exact same cell. Keeps behavior aligned with difficulty while
  // reducing predictability.
  private getOpeningMoveByDifficulty(): number {
    const corners = [0, 2, 6, 8];
    const edges = [1, 3, 5, 7];

    const rand = Math.random();

    switch (this.difficulty) {
      case 'expert':
        // Expert prefers center but sometimes plays a corner; occasionally choose best minimax move
        if (rand < 0.6 && this.squares[4] === null) return 4; // center
        if (rand < 0.9) return corners[Math.floor(Math.random() * corners.length)];
        // fallback: use minimax (randomized among ties)
        return this.getMinimaxMove();

      case 'moderate':
        // Moderate mixes center, corners and edges
        if (rand < 0.4 && this.squares[4] === null) return 4;
        if (rand < 0.8) return corners[Math.floor(Math.random() * corners.length)];
        return edges[Math.floor(Math.random() * edges.length)];

      case 'easy':
      default:
        // Easy: more random openings
        const all = [0,1,2,3,4,5,6,7,8];
        return all[Math.floor(Math.random() * all.length)];
    }
  }

  private minimax(board: any[], depth: number, isMaximizing: boolean): number {
    const winner = this.calculateWinner();
    
    if (winner === this.aiPlayer) return 10 - depth;
    if (winner === this.humanPlayer) return depth - 10;
    if (board.every(square => square !== null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = this.aiPlayer;
          const score = this.minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = this.humanPlayer;
          const score = this.minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return null;
  }
}