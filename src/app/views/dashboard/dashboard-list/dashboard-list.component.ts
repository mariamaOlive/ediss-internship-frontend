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
}
