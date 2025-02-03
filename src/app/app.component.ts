import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6 text-white text-center">
          Workout Tracker
        </h1>
        
        <mat-card class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <mat-card-header class="border-b border-blue-100 bg-blue-50">
            <mat-card-title class="text-blue-800 py-4 px-6">
              Add Workout
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="p-6">
            <app-workout-form></app-workout-form>
          </mat-card-content>
        </mat-card>

        <div class="mt-8 bg-white rounded-lg shadow-lg p-6">
          <app-workout-list></app-workout-list>
        </div>
      </div>
    </div>
  `,
  imports: [
    MatCardModule,
    WorkoutFormComponent,
    WorkoutListComponent
  ],
  standalone: true
})
export class AppComponent {
  title = 'workout-tracker';
}