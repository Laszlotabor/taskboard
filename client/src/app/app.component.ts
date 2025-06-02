import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';


@Component({
  selector: 'app-root', // <-- Use this selector, not 'router-outlet'
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'taskboard-client';
}
