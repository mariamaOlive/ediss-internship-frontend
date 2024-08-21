import { CommonModule  } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterModule, Router, RouterLink,  NavigationStart, NavigationEnd, NavigationError, NavigationCancel} from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { GridModule, CardModule, DropdownDividerDirective, TemplateIdDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective } from '@coreui/angular';
import { PlantService } from 'src/app/core/services/plant/plant.service';


@Component({
  selector: 'app-dashboard-list',
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
    DropdownDividerDirective],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.scss'
})

export class DashboardListComponent implements OnInit {
  plantsList : any[] = []

  constructor(private plantsService : PlantService, private router: Router){}

  ngOnInit():void {
    this.plantsService.getAllPlants().subscribe(plants=>{
      this.plantsList = plants;
    }
    );
  }
}
