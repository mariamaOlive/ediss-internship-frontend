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
  templateUrl: './plantslist.component.html',
  styleUrl: './plantslist.component.scss'
})
export class PlantslistComponent implements OnInit {
  plantsList : any[] = [];
  selectedPlant: string = "";
  confidenceThreshold: number = 0;

    constructor(private plantsServ : PlantService, private router: Router){

      // this.router.events.subscribe(event => {
      //   // debugger
      //   if (event instanceof NavigationStart) {
      //     console.log('NavigationStart:', event);
      //   } else if (event instanceof NavigationEnd) {
      //     console.log('NavigationEnd:', event);
      //   } else if (event instanceof NavigationError) {
      //     console.error('NavigationError:', event.error);
      //   } else if (event instanceof NavigationCancel) {
      //     console.warn('NavigationCancel:', event);
      //   }
      // });
    }

    ngOnInit():void {
      this.plantsServ.getAllPlants().subscribe(plants=>{
        this.plantsList = plants;
      }
      );
    }

    updateConfidenceThreshold(value: number): void {
      this.confidenceThreshold = parseFloat((value / 100).toFixed(2));
    }
}
