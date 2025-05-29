import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';

import { DragDropModule } from '@angular/cdk/drag-drop';




bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    importProvidersFrom(DragDropModule), // 👈 Add this line
  ],
});
