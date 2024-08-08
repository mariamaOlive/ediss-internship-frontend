import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { RouterModule, Router, RouterLink,  NavigationStart, NavigationEnd, NavigationError, NavigationCancel, ActivatedRoute  } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { RowComponent, ColComponent, CardModule, DropdownDividerDirective, TemplateIdDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective } from '@coreui/angular';
import { PlantService } from 'src/app/core/services/plant.service';


@Component({
  selector: 'app-plantslist',
  standalone: true,
  imports: [RouterModule, CommonModule,RowComponent, ColComponent,CardModule, TemplateIdDirective, IconDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, RouterLink, DropdownDividerDirective],
  templateUrl: './plantslist.component.html',
  styleUrl: './plantslist.component.scss'
})
export class PlantslistComponent implements OnInit {
  plantsList : any[] = []

    constructor(private plantsServ : PlantService, private router: Router){

      this.router.events.subscribe(event => {
        // debugger
        if (event instanceof NavigationStart) {
          console.log('NavigationStart:', event);
        } else if (event instanceof NavigationEnd) {
          console.log('NavigationEnd:', event);
        } else if (event instanceof NavigationError) {
          console.error('NavigationError:', event.error);
        } else if (event instanceof NavigationCancel) {
          console.warn('NavigationCancel:', event);
        }
      });
    }

    ngOnInit():void {
      this.plantsServ.getAllPlants().subscribe(plants=>{
        this.plantsList = plants;
      }
      );
    }

    // onButtonClick(){
    //   console.log("okye")
    //   // this.router.navigate(['/form-control'], { relativeTo: this.route });
    // }
}
