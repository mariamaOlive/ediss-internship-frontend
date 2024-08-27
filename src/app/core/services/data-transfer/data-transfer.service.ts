import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  private data: any;

  setData(data: any): void {
    this.data = data;
  }

  getData(): any {
    const temp = this.data;
    this.clearData();
    return temp;
  }

  clearData(): void {
    this.data = null;
  }
}
