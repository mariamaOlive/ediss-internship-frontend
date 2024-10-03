import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalModule,
  GridModule,
  CardModule,
  ButtonDirective,
  TemplateIdDirective,
  ThemeDirective,
  ButtonCloseDirective
} from '@coreui/angular';

@Component({
  selector: 'incidents-details',
  standalone: true,
  imports: [
    ModalModule,
    CommonModule,
    GridModule,
    CardModule,
    ButtonDirective,
    TemplateIdDirective,
    ThemeDirective,
    ButtonCloseDirective],
  templateUrl: './incidents-details.component.html',
  styleUrl: './incidents-details.component.scss'
})
export class IncidentsDetailsComponent {

  @Input() visibleModal : boolean = false;
  @Input() incidentsList : any[] | undefined = [];
  @Output() visibleModalChange = new EventEmitter<boolean>();


  /**
   * Handles changes to the modal's visibility.
   * @param event The event emitted when the modal's visibility changes.
   */
  handleModalChange(event: any) {
    this.visibleModal = event;
    this.visibleModalChange.emit(event);
  }
}
