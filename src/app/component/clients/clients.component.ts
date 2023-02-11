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
  windowScrolled: boolean = false;
  startingYear: number = 2010; // starting year that contains data in database
  activeFiltersText: string = '';
  activeFiltersTextFromDb: string = '';

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
      this.windowScrolled = window.pageYOffset >= 30;
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
      this.changeActiveFiltersText();
    });
    // get the filter text from the one created in the Filters Modal Form
    this.activeFiltersTextFromDb = this.activeFiltersText;
  }

  changeFiltersYearMinus() {
    let inputYear = this.filtersForm.controls.year.value;
    let currentYear = this.currentDate.getFullYear();
    // check if input is number
    if (Number.isInteger(inputYear)) {
      if (inputYear > this.startingYear) {
        if (inputYear <= currentYear) {
          inputYear -= 1;
        } else {
          inputYear = currentYear;
        }
      } else {
        inputYear = this.startingYear;
      }
    } else {
      inputYear = this.startingYear;
    }
    this.changeFiltersYear(inputYear);
  }

  changeFiltersYearPlus() {
    let inputYear = this.filtersForm.controls.year.value;
    let currentYear = this.currentDate.getFullYear();
    // check if input is number
    if (Number.isInteger(inputYear)) {
      if (inputYear >= this.startingYear) {
        if (inputYear < currentYear) {
          inputYear += 1;
        } else {
          inputYear = currentYear;
        }
      } else {
        inputYear = this.startingYear;
      }
    } else {
      inputYear = currentYear;
    }
    this.changeFiltersYear(inputYear);
  }

  changeFiltersYear(inputYear: number) {
    this.filtersForm = this.formbuilder.group({
      year: [inputYear],
      month: [this.filtersForm.controls.month.value],
      hideOption1Value: [this.filtersForm.controls.hideOption1Value.value],
      hideOption2Value: [this.filtersForm.controls.hideOption2Value.value],
    })
    this.changeActiveFiltersText();
  }

  changeFiltersMonth(monthNumber: number) {
    let inputYear = this.filtersForm.controls.year.value;
    let currentYear = this.currentDate.getFullYear();
    if (inputYear < this.startingYear || inputYear > this.startingYear) {
      inputYear = currentYear;
    }
    this.filtersForm = this.formbuilder.group({
      year: [inputYear],
      month: [monthNumber],
      hideOption1Value: [this.filtersForm.controls.hideOption1Value.value],
      hideOption2Value: [this.filtersForm.controls.hideOption2Value.value],
    })
    this.changeActiveFiltersText();
  }

  changeFiltersNoFilters() {
    this.filtersForm = this.formbuilder.group({
      year: [null],
      month: [null],
      hideOption1Value: [false],
      hideOption2Value: [false],
    })
    this.changeActiveFiltersText();
  }

  // change text of current filter selections from the Filters Modal's footer
  changeActiveFiltersText() {
    let month: string = '';
    if (this.filtersForm.controls.month.value) {
      switch (this.filtersForm.controls.month.value) {
        case 1:
          month = 'Ianuarie';
          break;
        case 2:
          month = 'Februarie';
          break;
        case 3:
          month = 'Martie';
          break;
        case 4:
          month = 'Aprilie';
          break;
        case 5:
          month = 'Mai';
          break;
        case 6:
          month = 'Iunie';
          break;
        case 7:
          month = 'Iulie';
          break;
        case 8:
          month = 'August';
          break;
        case 9:
          month = 'Septembrie';
          break;
        case 10:
          month = 'Octombrie';
          break;
        case 11:
          month = 'Noiembrie';
          break;
        case 12:
          month = 'Decembrie';
          break;
      }
    }
    const year = this.filtersForm.controls.year.value;

    let filtreSpeciale: string = '';
    let filtreSpeciale1: string = '';
    let filtreSpeciale2: string = '';
    let filtreSpecialeCount: number = 0;
    this.filtersHideOption1Text;
    if (this.filtersForm.controls.hideOption1Value.value) {
      filtreSpeciale = 'Fara text: ';
      filtreSpeciale1 = this.filtersHideOption1Text;
      filtreSpecialeCount += 1;
    }
    if (this.filtersForm.controls.hideOption2Value.value) {
      filtreSpeciale = 'Fara text: ';
      filtreSpeciale2 = this.filtersHideOption2Text;
      filtreSpecialeCount += 1;
    }
    if (filtreSpecialeCount == 2) {
      // if there are 2 special filters selected then add a comma and space as a separator
      filtreSpeciale = filtreSpeciale + filtreSpeciale1 + ", " + filtreSpeciale2;
    } else {
      // if not then just concatenate the variables (one of them will be empty so it does not affect the string output)
      filtreSpeciale = filtreSpeciale + filtreSpeciale1 + filtreSpeciale2;
    }

    // concatenate complete text using the calculated variables. If all variables are '' (null/empty), the output string will be ' null ;'
    this.activeFiltersText = month + ' ' + year + ' ; ' + filtreSpeciale;
    if (this.activeFiltersText.indexOf(' null ; ') > -1) {
      if (filtreSpeciale) {
        this.activeFiltersText = filtreSpeciale;
      } else {
        this.activeFiltersText = 'Fara Filtre';
      }
    } else {
      if (!filtreSpeciale) {
        this.activeFiltersText = month + ' ' + year;
      }
    }
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