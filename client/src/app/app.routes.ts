import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BoardListComponent } from './components/boards/boards.component';
import { CreateBoardComponent } from './components/createboards/createboards.component';




export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'boards', component: BoardListComponent },

  { path: 'create-board', component: CreateBoardComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Redirect empty path to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Wildcard route to catch unknown URLs and redirect to login
  { path: '**', redirectTo: 'login' },
];

