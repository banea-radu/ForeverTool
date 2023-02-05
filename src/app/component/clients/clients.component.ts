import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MenuService } from 'src/app/service/menu.service';
import { DatabaseService } from 'src/app/service/database.service';
import { Observable } from "rxjs";
import { ViewportScroller } from '@angular/common';
import { map } from 'rxjs/operators';


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
    id: ['']
  })

  constructor(
    public databaseService: DatabaseService,
    private formbuilder: FormBuilder,
    public menuService: MenuService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    // this.getClients();
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  getClients() {
    this.clients$ = this.databaseService.getData('clients'); // 'test' or 'clients'
  }

  searchInput(event, searchString: string) {
  if (event.key === "Enter") {
    this.searchClients(searchString);
  }
  }

  searchClients(searchString: string) {
    if (searchString == '' || searchString == null) {
      // then get all clients
      this.getClients();
    } else {
      this.clients$ = this.databaseService.getData('clients') // 'test' or 'clients'
      .pipe (
        map(response => 
          response.filter(item => 
            (item.Abordare + " "
              + item.Cunosc + " "
              + item.Detalii + " "
              + item.FollowUp + " "
              + item.Id + " "
              + item.Invite + " "
              + item.Kids + " "
              + item.Locatie + " "
              + item.NextStep + " "
              + item.Nume).toUpperCase()
                .indexOf(searchString.toUpperCase()) > -1
          )
        )
      )
    }
  }

  saveIdToChangeAfterConfirmation(item: any) {
    this.itemToChangeAfterConfirmation = item;
    this.editForm = this.formbuilder.group({
      Abordare: [item.Abordare],
      Cunosc: [item.Cunosc],
      Detalii: [item.Detalii],
      FollowUp: [item.FollowUp],
      Id: [item.Id],
      Invite: [item.Invite],
      Kids: [item.Kids],
      Locatie: [item.Locatie],
      NextStep: [item.NextStep],
      Nume: [item.Nume],
      id: [item.id]
    })
  }

  submitEditForm() {
    this.databaseService.patchData('clients', this.editForm.value, this.itemToChangeAfterConfirmation.id)
    .subscribe(() => {
      console.log('item changed in db');
      // change the item also in the html template without refreshing the component
      this.itemToChangeAfterConfirmation.Nume = this.editForm.value.Nume;
      this.itemToChangeAfterConfirmation.Detalii = this.editForm.value.Detalii;
      this.itemToChangeAfterConfirmation.FollowUp = this.editForm.value.FollowUp;
      this.itemToChangeAfterConfirmation.Invite = this.editForm.value.Invite;
      this.itemToChangeAfterConfirmation.Cunosc = this.editForm.value.Cunosc;
      this.itemToChangeAfterConfirmation.Locatie = this.editForm.value.Locatie;
      this.itemToChangeAfterConfirmation.Abordare = this.editForm.value.Abordare;
      this.itemToChangeAfterConfirmation.NextStep = this.editForm.value.NextStep;
      this.itemToChangeAfterConfirmation.Kids = this.editForm.value.Kids;
    })
  }

}