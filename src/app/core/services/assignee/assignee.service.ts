import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssigneeService {

  private dataAssignees = [
    {name: "Anna Bianchi", id: 1},
    {name: "Giorgia Versace", id: 2},
    {name: "Marta Bergman", id: 3},
    {name: "Pietro Björn", id: 4}
  ]

  constructor() { }

  getAllAssignees(){
    return of(this.dataAssignees);
  }
  
}
