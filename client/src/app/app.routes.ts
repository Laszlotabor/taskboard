import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';


export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Redirect empty path to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Wildcard route to catch unknown URLs and redirect to login
  { path: '**', redirectTo: 'login' },
];

