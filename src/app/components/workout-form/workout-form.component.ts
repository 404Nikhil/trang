import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { WorkoutService } from '../../services/workout.service';

@Component({
  selector: 'app-workout-form',
  template: `
    <form [formGroup]="workoutForm" (ngSubmit)="onSubmit()" class="space-y-4 p-4">
      <div>
        <mat-form-field class="w-full">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter name">
        </mat-form-field>
      </div>

      <div>
        <mat-form-field class="w-full">
          <mat-label>Workout Type</mat-label>
          <mat-select formControlName="workoutType">
            <mat-option value="Running">Running</mat-option>
            <mat-option value="Cycling">Cycling</mat-option>
            <mat-option value="Swimming">Swimming</mat-option>
            <mat-option value="Yoga">Yoga</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div>
        <mat-form-field class="w-full">
          <mat-label>Minutes</mat-label>
          <input matInput type="number" formControlName="minutes" placeholder="Enter minutes">
        </mat-form-field>
      </div>

      <button 
        class="bg-gradient-to-br from-blue-600 to-blue-800 cursor-pointer px-6 py-3 mt-4 
               hover:shadow-lg transition-all duration-300" 
        mat-raised-button 
        type="submit" 
        [disabled]="!workoutForm.valid">
        Add Workout
      </button>
    </form>
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class WorkoutFormComponent {
  workoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private workoutService: WorkoutService
  ) {
    this.workoutForm = this.fb.group({
      name: ['', Validators.required],
      workoutType: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.workoutForm.valid) {
      const { name, workoutType, minutes } = this.workoutForm.value;
      this.workoutService.addWorkout(name, workoutType, parseInt(minutes, 10));
      this.workoutForm.reset();
    }
  }
}