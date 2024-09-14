import { Component, Input } from '@angular/core';
import {
  ButtonDirective,
  ProgressBarComponent,
  ProgressBarDirective,
  ProgressComponent,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent,
} from '@coreui/angular';

@Component({
  selector: 'toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.scss'],
  standalone: true,
  imports: [ ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent, ProgressBarDirective, ProgressComponent, ProgressBarComponent, ButtonDirective]
})
export class ToastMessageComponent {
  @Input() message: string = 'Hello, world! This is a toast message.';  // Default message
  @Input() type: 'success' | 'error' = 'success';  // Color type for toast

  position = 'top-end';  // Default toast position
  visible = false;       // Visibility state
  percentage = 0;        // Timer percentage

  // Toggles the toast visibility
  toggleToast() {
    this.visible = !this.visible;
  }

  // Updates visibility state and resets the percentage when toast is closed
  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  // Updates the progress bar based on timer change
  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }

  getToastClass(): string {
    return this.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white';
  }
}
