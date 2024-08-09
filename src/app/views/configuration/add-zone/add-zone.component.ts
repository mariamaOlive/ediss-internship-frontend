import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZoneItem } from 'src/app/core/models/zone';
import { ZoneService } from 'src/app/core/services/zone.service';

@Component({
  selector: 'app-add-zone',
  standalone: true,
  imports: [],
  templateUrl: './add-zone.component.html',
  styleUrl: './add-zone.component.scss'
})
export class AddZoneComponent {

  constructor(private router: Router, private route: ActivatedRoute, private zoneServ: ZoneService) {
    //TODO: Get Plant Id

  }

  addNewZone(): void {

    var newZone:ZoneItem = new ZoneItem("My Zone", Math.random(), 1);

    this.zoneServ.addZone(newZone).subscribe({
      next: () => {
        //TODO: Return to the previous page
        console.log('ADDED:');
      },
      error: err => {
        console.error('Error deleting zone:', err);
      }
    });
  }

}
