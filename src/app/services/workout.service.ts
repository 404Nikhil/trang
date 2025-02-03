import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Workout } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly STORAGE_KEY = 'workoutData';
  private users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeData();
    }
  }

  private initializeData(): void {
    try {
      const initialData: User[] = [
        // ...existing initial data...
      ];

      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        this.users.next(JSON.parse(storedData));
      } else {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
        this.users.next(initialData);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Fallback to memory-only storage
      this.users.next([]);
    }
  }

  getUsers(): Observable<User[]> {
    return this.users.asObservable();
  }

  addWorkout(name: string, workoutType: string, minutes: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const currentUsers = this.users.value;
      let user = currentUsers.find(u => u.name === name);

      if (user) {
        user.workouts.push({ type: workoutType, minutes });
      } else {
        user = {
          id: currentUsers.length + 1,
          name,
          workouts: [{ type: workoutType, minutes }]
        };
        currentUsers.push(user);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentUsers));
      this.users.next(currentUsers);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
}