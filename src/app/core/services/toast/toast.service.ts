import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<{ message: string, type: 'success' | 'error' }>();
  toastState$ = this.toastSubject.asObservable();

  /**
   * Trigger a new toast message.
   */
  showToast(message: string, type: 'success' | 'error') {
    this.toastSubject.next({ message, type });
  }
}
