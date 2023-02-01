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
  itemToChangeAfterConfirmation: any = {}; // replace any with model
  editForm = this.formbuilder.group({
    Abordare: [''],
    Cunosc: [''],
    Detalii: [''],
    FollowUp: [''],
    Id: [''],
    Invite: [''],
    Kids: [''],
    Locatie: [''],
    NextStep: [''],
    Nume: [''],
  })

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

  saveIdToChangeAfterConfirmation(item: any) {
    this.itemToChangeAfterConfirmation = item;
    console.log(item.id);
  }

  submitEditForm() {
    console.log(this.itemToChangeAfterConfirmation);
  }

}