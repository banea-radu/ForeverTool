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

  currentDate = new Date();
  filtersHideOption1Text: string = 'nu e avatar';
  filtersHideOption2Text: string = 'unfriended';
  filtersForm = this.formbuilder.group({
    year: [this.currentDate.getFullYear()],
    month: [this.currentDate.getMonth()],
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
    this.getFiltersData();
    // add event listener for showing/hiding the up arrow button
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    });
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  getClients() {
    this.clients$ = this.databaseService.getClients();
  }

  searchInputEventListener(event, searchString: string) {
    if (event.key === "Enter") {
      this.searchClients(searchString);
    }
  }

  searchClients(searchString: string) {
    if (searchString == '' || searchString == null) {
      // then get all clients
      this.getClients();
    } else {
      this.clients$ = this.databaseService.getClients()
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

  saveItemToChangeAfterConfirmation(item: any) {
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
    this.databaseService.patchClient(this.editForm.value, this.itemToChangeAfterConfirmation.id)
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

  getFiltersData() {
    this.databaseService.getFilters().subscribe((response: any) => {
      this.filtersForm = this.formbuilder.group({
        year: [response.year],
        month: [response.month],
        hideOption1Value: [response.hideOption1Value],
        hideOption2Value: [response.hideOption2Value],
      })
    });
  }

  changeFiltersYear(addOrSubstract: number) {
    // check if input is number
    let year = this.filtersForm.controls.year.value;
    if (+year) { // unary plus operator returns NaN if year is not a number
      year += addOrSubstract;
    } else {
      year = this.currentDate.getFullYear() ;
    }
    this.filtersForm = this.formbuilder.group({
      year: [this.filtersForm.controls.year.value + addOrSubstract],
      month: [this.filtersForm.controls.month.value],
      hideOption1Value: [this.filtersForm.controls.hideOption1Value.value],
      hideOption2Value: [this.filtersForm.controls.hideOption2Value.value],
    })
  }

  changeFiltersMonth(monthNumber: number) {
    this.filtersForm = this.formbuilder.group({
      year: [this.filtersForm.controls.year.value],
      month: [monthNumber],
      hideOption1Value: [this.filtersForm.controls.hideOption1Value.value],
      hideOption2Value: [this.filtersForm.controls.hideOption2Value.value],
    })
  }

  changeFiltersNoFilters() {
    this.filtersForm = this.formbuilder.group({
      year: [],
      month: [],
      hideOption1Value: [],
      hideOption2Value: [],
    })
  }

  submitFiltersForm() {
    // alert("Inca nu merge, lucrez la el");
    // console.log(this.filterForm.value);
    this.databaseService.patchFilters(this.filtersForm.value)
    .subscribe(() => {
      console.log('filters saved in db');
    })
  }

}