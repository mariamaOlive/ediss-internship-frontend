import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import {
  GridModule,
  CardModule,
  DropdownDividerDirective,
  TemplateIdDirective,
  ThemeDirective,
  DropdownComponent,
  ButtonDirective,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
} from '@coreui/angular';

@Component({
  selector: 'card-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    GridModule, CardModule,
    TemplateIdDirective,
    IconDirective,
    ThemeDirective,
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    DropdownDividerDirective,
    RouterLink],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent {

  @Input() cardList: Array<{ name: string, description: string, id: number, message: string }> = [];
  @Input() dropdownOptions: Array<{ label: string, action: string }> = [];
  @Input() emptyCardText: string = "";
  @Output() cardClick = new EventEmitter<number>();
  @Output() emptyCardClick = new EventEmitter<void>();
  @Output() dropdownOptionClick = new EventEmitter<{ cardId: number, action: string }>();
  @Input() topContainerColor: string = '';
  @Input() showEmptyCard: boolean = true;

  // ========================
  // Interaction Functions
  // ========================

  // Trigges on the click of one the cards of the list
  onCardClick(cardId: number): void {
    this.cardClick.emit(cardId);
  }

  // Emits an event on the click of the empty card
  onEmptyCardClick(): void {
    this.emptyCardClick.emit();
  }

  // Triggers on selecting a dropdown option
  onDropdownOptionClick(cardId: number, action: string): void {
    this.dropdownOptionClick.emit({ cardId, action });
  }

}
