import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MenuService } from 'src/app/service/menu.service';
import { DatabaseService } from 'src/app/service/database.service';
import { Observable } from "rxjs";
import { ViewportScroller } from '@angular/common';
import { map, tap } from 'rxjs/operators';
import { ElementRef, ViewChild  } from '@angular/core';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  @ViewChild('searchButton') searchButton: ElementRef<HTMLElement>;
  clients$: Observable<any[]>;
  searchNumberOfResults: number;
  itemToChangeAfterConfirmation: any = {};
  windowScrolled: boolean = false;
  startingYear: number = 2010; // starting year from which data is available in the database
  modalFiltersText: string = '';
  activeFiltersText: string = '';
  loadingScreen: boolean = true;
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
    this.getFiltersData();
    // add event listener for showing/hiding the up arrow button
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset >= 400;
    });
  }

  getClientsTest() {
    const startAtDate = new Date(this.filtersForm.controls.year.value,this.filtersForm.controls.month.value - 1);
    const startAtId: number = startAtDate.getTime() / 1000;
    const endAtDate = new Date(this.filtersForm.controls.year.value,this.filtersForm.controls.month.value);
    const endAtId: number = endAtDate.getTime() / 1000;
    console.log(startAtId, endAtId);

    this.databaseService.getClientsTest(startAtId, endAtId).subscribe((res) => {

      // let nr = 0;
      // let st = 0;
      // res.forEach((item) => {
      //   if (typeof item.Id == 'number') {
      //     nr++;
      //   }
      //   if (typeof item.Id == 'string') {
      //     st++;
      //   }
      // })
      // console.log('nr: ', nr);
      // console.log('st: ', st);

      console.log(res);
    });
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  // if user presses 'Enter' key, then call the 'searchClients' function
  searchInputEventListener(event, searchString: string) {
    if (event.key === "Enter") {
      this.searchClients(searchString);
    }
  }

  searchClients(searchString: string) {
    this.loadingScreen = true;
    this.clients$ = this.databaseService.getClients()
      .pipe(
        map(response => 
          response.filter(item =>
            // return only the items that contain the search string from the input, if string is empty it will return all items
            ((item.Abordare + " "
              + item.Cunosc + " "
              + item.Detalii + " "
              + item.FollowUp + " "
              + item.Id + " "
              + item.Invite + " "
              + item.Kids + " "
              + item.Locatie + " "
              + item.NextStep + " "
              + item.Nume).toUpperCase().indexOf(searchString.toUpperCase()) > -1)
            &&
            // return only the items that have been connected with in the year selected in the Filters Modal Form, if a year was selected
            (this.filtersForm.controls.year.value
              // item.Id is epoch time
              ? +(new Date(item.Id * 1000)).getFullYear() == this.filtersForm.controls.year.value
              : true
            )
            &&
            // return only the items that have been connected with in month selected in the Filters Modal Form, if a month was selected
            (this.filtersForm.controls.month.value
              ? +(new Date(item.Id * 1000)).getMonth()+1 == this.filtersForm.controls.month.value
              : true
            )
            &&
            // return only the items that don't contain the search string from the 1st checkbox option in the Filters Modal Form, if the checkbox is checked
            (this.filtersForm.controls.hideOption1Value.value
              ? ((item.Abordare + " "
                + item.Cunosc + " "
                + item.Detalii + " "
                + item.FollowUp + " "
                + item.Id + " "
                + item.Invite + " "
                + item.Kids + " "
                + item.Locatie + " "
                + item.NextStep + " "
                + item.Nume).toUpperCase().indexOf(this.filtersHideOption1Text.toUpperCase()) == -1)
              : true
            )
            &&
            // return only the items that don't contain the search string from the 2nd checkbox option in the Filters Modal Form, if the checkbox is checked
            (this.filtersForm.controls.hideOption2Value.value
              ? ((item.Abordare + " "
                + item.Cunosc + " "
                + item.Detalii + " "
                + item.FollowUp + " "
                + item.Id + " "
                + item.Invite + " "
                + item.Kids + " "
                + item.Locatie + " "
                + item.NextStep + " "
                + item.Nume).toUpperCase().indexOf(this.filtersHideOption2Text.toUpperCase()) == -1)
              : true
            )
          )
        ),
        tap((response) => {
          this.searchNumberOfResults = response.length;
          this.loadingScreen = false;
        })
      )
    // setTimeout(() => {
    //   this.loadingScreen = false;
    // }, 1000);
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
    const localStorageFilters = JSON.parse(localStorage.getItem('filters'));
    if (!localStorageFilters) {
      this.changeFiltersNoFilters();
    } else {
      this.filtersForm = this.formbuilder.group({
        year: [localStorageFilters.year],
        month: [localStorageFilters.month],
        hideOption1Value: [localStorageFilters.hideOption1Value],
        hideOption2Value: [localStorageFilters.hideOption2Value],
      });
      this.changeModalFiltersText();
    }
    // change the filter text with the local storage filters data
    setTimeout(() => {
      this.activeFiltersText = this.modalFiltersText;
      this.loadingScreen = false;
    }, 850);
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
    this.changeModalFiltersText();
  }

  changeFiltersMonth(monthNumber: number) {
    let inputYear = this.filtersForm.controls.year.value;
    let currentYear = this.currentDate.getFullYear();
    if (inputYear < this.startingYear || inputYear > currentYear) {
      inputYear = currentYear;
    }
    this.filtersForm = this.formbuilder.group({
      year: [inputYear],
      month: [monthNumber],
      hideOption1Value: [this.filtersForm.controls.hideOption1Value.value],
      hideOption2Value: [this.filtersForm.controls.hideOption2Value.value],
    })
    this.changeModalFiltersText();
  }

  changeFiltersNoFilters() {
    this.filtersForm = this.formbuilder.group({
      year: [null],
      month: [null],
      hideOption1Value: [false],
      hideOption2Value: [false],
    })
    this.changeModalFiltersText();
  }

  // change text of current filter selections from the Filters Modal's footer
  changeModalFiltersText() {
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
    this.modalFiltersText = month + ' ' + year + ' ; ' + filtreSpeciale;
    if (this.modalFiltersText.indexOf(' null ; ') > -1) {
      if (filtreSpeciale) {
        this.modalFiltersText = filtreSpeciale;
      } else {
        this.modalFiltersText = 'Fara Filtre';
      }
    } else {
      if (!filtreSpeciale) {
        this.modalFiltersText = month + ' ' + year;
      }
    }
  }

  submitFiltersForm() {
    this.loadingScreen = true;
    localStorage.setItem('filters', JSON.stringify(this.filtersForm.value));
    // trigger click event of search input to search again with the new filters
    this.searchButton.nativeElement.click();
    this.activeFiltersText = this.modalFiltersText;
  }

}