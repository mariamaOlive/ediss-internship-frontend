import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, } from '@angular/router';
import { ZoneService } from 'src/app/core/services/zone.service';
import { CameraItem } from 'src/app/core/models/camera';
import { ZoneItem } from 'src/app/core/models/zone';
import { CardModule, ButtonModule, GridModule, BadgeModule, FormModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PlantService } from 'src/app/core/services/plant.service';
import { AssigneeService } from 'src/app/core/services/assignee.service';
import { PlantItem } from 'src/app/core/models/plant';


@Component({
  selector: 'app-add-zone',
  standalone: true,
  imports: [CardModule, ButtonModule, GridModule, CommonModule, BadgeModule, IconDirective, FormModule, NgMultiSelectDropDownModule, FormsModule],
  templateUrl: './add-zone.component.html',
  styleUrl: './add-zone.component.scss'
})
export class AddZoneComponent implements OnInit {
  plantId: any = NaN;
  plant: PlantItem | null = null;
  assignees: any;

  //New Zone properties
  zoneName: string = '';
  selectedAssignee: number | null = null;
  confidenceThreshold: number = 0; 


  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};

  constructor(private router: Router, private route: ActivatedRoute, private zoneServ: ZoneService, private plantServ: PlantService, private assigneeServ: AssigneeService) {
    //TODO: Get Plant Id

  }

  ngOnInit() {

    //Get plant info by ID
    this.getPlantInfo();
    this.getAvailableAssigees();














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
    const newZone: ZoneItem = new ZoneItem("My Zone", Math.random(), 1, "Minase Serafim", .5, true, ["Vest", "Hairnet", "Goggles", "Earplugs"], cameras);

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

  private getPlantInfo(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('plantId');
      if (id) {
        this.plantId = id;
        this.plantServ.getPlantById(parseInt(id, 10)).subscribe({
          next: plant => {
            this.plant = plant;
            this.confidenceThreshold = this.plant.confidenceThreshold;
          },
          error: err => {
            console.error('Error fetching zones:', err);
          }
        });
      }
    });
  }

  private getAvailableAssigees(){
    this.assigneeServ.getAllAssignees().subscribe({
      next: assignees => {
        this.assignees = assignees;
      },
      error: err => {
        console.error('Error fetching assignees:', err);
      }
    });
  }

  updateConfidenceThreshold(value: number): void {
    this.confidenceThreshold = value / 100;
  }

}
