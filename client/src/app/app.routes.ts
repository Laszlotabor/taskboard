import { Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { CardComponent } from './components/card/card.component';
import { ListComponent } from './components/list/list.component';

export const routes: Routes = [
  { path: 'board', component: BoardComponent },
  { path: 'card', component: CardComponent },
  { path: 'list', component: ListComponent }
];
