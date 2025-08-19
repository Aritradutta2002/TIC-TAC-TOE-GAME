import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('light');
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('tic-tac-toe-theme') as Theme;
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }

  setTheme(theme: Theme) {
    this.themeSubject.next(theme);
    localStorage.setItem('tic-tac-toe-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    const currentTheme = this.themeSubject.value;
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }
}
