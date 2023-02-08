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
  filters$: any;
  itemToChangeAfterConfirmation: any = {}; // replace any with model
  windowScrolled = false;

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

  filterDate = new Date();
  // januarySelected: boolean = false;
  // februarySelected: boolean = false;
  // marchSelected: boolean = false;
  // aprilSelected: boolean = false;
  // maySelected: boolean = false;
  // juneSelected: boolean = false;
  // januarySelected: boolean = false;
  // januarySelected: boolean = false;
  // januarySelected: boolean = false;
  // januarySelected: boolean = false;
  // januarySelected: boolean = false;
  // januarySelected: boolean = false;
  filterHideOption1Text: string = 'nu e avatar';
  filterHideOption2Text: string = 'unfriended';
  filterForm = this.formbuilder.group({
    filterDateYear: [this.filterDate.getFullYear()],
    filterDateMonth: [this.filterDate.getMonth()],
    hideOption1Value: [false],
    hideOption2Value: [false],
  });

  constructor(
    public databaseService: DatabaseService,
    private formbuilder: FormBuilder,
    public menuService: MenuService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    // this.getClients();
    this.getFilterData();
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    });
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
      .pipe(
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
    this.databaseService.patchClientsData('clients', this.editForm.value, this.itemToChangeAfterConfirmation.id)
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

  getFilterData() {
    this.databaseService.getData('filters').subscribe((response => {
      console.log(response);
      // this.filterForm = this.formbuilder.group({
      //   filterDateYear: [this.filterDate.getFullYear()],
      //   filterDateMonth: [this.filterDate.getMonth()],
      //   hideOption1Value: [false],
      //   hideOption2Value: [false],
      // })
    }));
  }

  changeFilterYear(addOrSubstract: number) {
    // this.filterForm.controls.filterDateYear.setValue = 2022;
  }

  changeFilterMonth(monthNumber: number) {
    this.filterForm = this.formbuilder.group({
      filterDateYear: [this.filterForm.controls.filterDateYear.value],
      filterDateMonth: [monthNumber],
      hideOption1Value: [this.filterForm.controls.hideOption1Value.value],
      hideOption2Value: [this.filterForm.controls.hideOption2Value.value],
    })
  }

  submitFilterForm() {
    // alert("Inca nu merge, lucrez la el");
    // console.log(this.filterForm.value);
    this.databaseService.patchFiltersData('filters', this.filterForm.value)
    .subscribe(() => {
      console.log('filters saved in db');
    })
  }

}