import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BoardListComponent } from './components/boards/boards.component';
import { CreateBoardComponent } from './components/createboards/createboards.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth.guard';





export const routes: Routes = [
  // Public routes
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'navbar', component: NavbarComponent }, 

  // Protected routes
  { path: 'boards', component: BoardListComponent, canActivate: [AuthGuard] },
  {
    path: 'create-board',
    component: CreateBoardComponent,
    canActivate: [AuthGuard],
  },

  // Redirects
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

