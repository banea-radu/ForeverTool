import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MenuService } from 'src/app/service/menu.service';
import { DatabaseService } from 'src/app/service/database.service';
import { Observable } from "rxjs";
import { ViewportScroller } from '@angular/common';
// import { DbProgram } from 'src/app/model/db-program';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  clients$: Observable<any[]>;
  clientToChangeAfterConfirmation: any = {};
  newClientForm = this.formbuilder.group({
    Day: ['Monday'],
    StartHour: ['07'],
    StartMinute: ['00'],
    EndHour: ['07'],
    EndMinute: ['00'],
    Category: ['Intermediate']
  })
  timeHours = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  timeMinutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  constructor(
    public databaseService: DatabaseService,
    private formbuilder: FormBuilder,
    public menuService: MenuService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.getClients();
  }

  getClients() {
    this.clients$ = this.databaseService.getData('test'); // 'clients'
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  saveClientToChangeAfterConfirmation(client: any) {
    this.clientToChangeAfterConfirmation = client;
    console.log(client);
  }

}