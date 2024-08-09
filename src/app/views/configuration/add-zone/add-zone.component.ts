import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZoneItem } from 'src/app/core/models/zone';
import { ZoneService } from 'src/app/core/services/zone.service';
import { CameraItem } from 'src/app/core/models/camera';

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

    const cameras: CameraItem[] = [new CameraItem("Camera 1", 1, "187.20.135.197"), new CameraItem("Camera 1", 1, "187.20.135.199"), new CameraItem("Camera 1", 1, "187.20.135.200")];
    const newZone:ZoneItem = new ZoneItem("My Zone", Math.random(), 1,  "Minase Serafim", ["Vest", "Hairnet", "Goggles", "Earplugs"], cameras);

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
