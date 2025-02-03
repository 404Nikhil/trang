import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workout-list',
  template: `
    <div class="p-4">
      <div class="mb-4 flex space-x-4">
        <mat-form-field class="w-full">
          <mat-label>Search by name</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterUsers()" placeholder="Search users...">
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Filter by workout type</mat-label>
          <mat-select [(ngModel)]="selectedWorkoutType" (selectionChange)="filterUsers()">
            <mat-option value="">All</mat-option>
            <mat-option value="Running">Running</mat-option>
            <mat-option value="Cycling">Cycling</mat-option>
            <mat-option value="Swimming">Swimming</mat-option>
            <mat-option value="Yoga">Yoga</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <table mat-table [dataSource]="paginatedUsers" class="w-full">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let user">{{user.name}}</td>
        </ng-container>

        <ng-container matColumnDef="workouts">
          <th mat-header-cell *matHeaderCellDef>Workouts</th>
          <td mat-cell *matCellDef="let user">
            {{getWorkoutSummary(user.workouts)}}
          </td>
        </ng-container>

        <ng-container matColumnDef="totalMinutes">
          <th mat-header-cell *matHeaderCellDef>Total Minutes</th>
          <td mat-cell *matCellDef="let user">
            {{getTotalMinutes(user.workouts)}}
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator
        [length]="filteredUsers.length"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25]"
        (page)="onPageChange($event)">
      </mat-paginator>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class WorkoutListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  searchTerm = '';
  selectedWorkoutType = '';
  pageSize = 5;
  currentPage = 0;
  displayedColumns = ['name', 'workouts', 'totalMinutes'];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.workoutService.getUsers().subscribe(users => {
      this.users = users.reverse();
      this.filterUsers();
    });
  }

  filterUsers(): void {
    this.currentPage = 0; // Reset to first page when filtering
    this.filteredUsers = this.users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const workoutMatch = !this.selectedWorkoutType || 
        user.workouts.some(w => w.type === this.selectedWorkoutType);
      return nameMatch && workoutMatch;
    });
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedUsers();
  }

  getWorkoutSummary(workouts: any[]): string {
    return workouts.map(w => `${w.type} (${w.minutes}min)`).join(', ');
  }

  getTotalMinutes(workouts: any[]): number {
    return workouts.reduce((total, w) => total + w.minutes, 0);
  }
}