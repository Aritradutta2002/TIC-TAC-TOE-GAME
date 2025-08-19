import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app';
import { BoardComponent } from './board/board.component';
import { GameService } from './game.service';

@NgModule({
  imports: [
    BrowserModule,
    BoardComponent,
    AppComponent
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }