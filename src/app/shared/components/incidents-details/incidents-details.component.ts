import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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

  @Input() visibleModal: boolean = false;
  @Input() incidentsList: any[] | undefined = [];
  @Output() visibleModalChange = new EventEmitter<boolean>();
  processedIncidentsList: any[] | undefined = [];

  /**
   * Updates `processedIncidentsList` whenever `incidentsList` changes,
   * ensuring immutability by creating a cloned and processed version.
   *
   * @param changes - Tracks changes to input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['incidentsList'] && this.incidentsList) {
      // Deep clone the incidentsList to avoid any direct mutations
      this.processedIncidentsList = this.incidentsList.map(incident => ({
        ...incident,
        class_name: this.getCounts(incident.class_name)
      }));
    }
  }

  /**
   * Handles changes to the modal's visibility.
   * @param event The event emitted when the modal's visibility changes.
   */
  handleModalChange(event: any) {
    this.visibleModal = event;
    this.visibleModalChange.emit(event);
  }

  /**
  * Processes a comma-separated input string to count the occurrences of each unique item.
  *
  * @param inputString - A string containing items separated by commas (e.g., "mask,goggles,vest").
  * @returns A formatted string where each unique item is listed with its count, in the format "item: count".
  */
  getCounts(inputString: string): string {
    const items = inputString.split(",");
    const counter: { [key: string]: number } = {};

    items.forEach(item => {
      counter[item] = (counter[item] || 0) + 1;
    });

    return Object.entries(counter)
      .map(([item, count]) => `${count} ${item}`)
      .join(", ");
  }


}
