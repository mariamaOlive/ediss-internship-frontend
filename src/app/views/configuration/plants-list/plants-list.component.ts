import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterModule, Router, RouterLink,  NavigationStart, NavigationEnd, NavigationError, NavigationCancel} from '@angular/router';
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
  ModalModule,
  ButtonCloseDirective,
  FormModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { PlantService } from 'src/app/core/services/plant/plant.service';


@Component({
  selector: 'app-plantslist',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    GridModule,CardModule,
    TemplateIdDirective,
    IconDirective,
    ThemeDirective,
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    RouterLink,
    DropdownDividerDirective, 
    ModalModule,
    ButtonCloseDirective,
    FormModule,
    FormsModule],
  templateUrl: './plants-list.component.html',
  styleUrl: './plants-list.component.scss'
})
export class PlantsListComponent implements OnInit {
  plantsList : any[] = [];
  selectedPlant: string = "";
  confidenceThreshold: number = 0;

    constructor(private plantsService : PlantService, private router: Router){}

    ngOnInit():void {
      this.plantsService.getAllPlants().subscribe(plants=>{
        this.plantsList = plants;
      }
      );
    }

    updateConfidenceThreshold(value: number): void {
      this.confidenceThreshold = parseFloat((value / 100).toFixed(2));
    }
}
