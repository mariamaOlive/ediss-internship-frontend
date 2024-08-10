import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZoneService } from 'src/app/core/services/zone.service';
import { CameraItem } from 'src/app/core/models/camera';
import { ZoneItem } from 'src/app/core/models/zone';
import { CardModule, ButtonModule, GridModule, BadgeModule, FormModule} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-add-zone',
  standalone: true,
  imports: [CardModule, ButtonModule, GridModule, CommonModule, BadgeModule, IconDirective, FormModule, NgMultiSelectDropDownModule, FormsModule],
  templateUrl: './add-zone.component.html',
  styleUrl: './add-zone.component.scss'
})
export class AddZoneComponent implements OnInit{
  dropdownList:any[] = [];
  selectedItems:any[] = [];
  dropdownSettings = {};

  constructor(private router: Router, private route: ActivatedRoute, private zoneServ: ZoneService) {
    //TODO: Get Plant Id

  }

  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Helmet' },
      { item_id: 2, item_text: 'Hair Net' },
      { item_id: 3, item_text: 'Goggles' },
      { item_id: 4, item_text: 'Vest' },
      { item_id: 5, item_text: 'Earplugs' }
    ];
    this.selectedItems = [
      // { item_id: 3, item_text: 'Pune' },
      // { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: false
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
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
