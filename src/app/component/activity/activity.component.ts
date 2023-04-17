import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/service/database.service';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent {
  @ViewChild('modalCloseButton1') modalCloseButton1;
  @ViewChild('modalCloseButton2') modalCloseButton2;
  
  today: Date = new Date();
  selectedDate: Date = this.today;
  firstAndLastDayOfWeek: any = this.getFirstAndLastDayOfWeek(this.selectedDate); // object that will hold the first day and last day of the week
  weekId: string = this.createWeekIdString(this.firstAndLastDayOfWeek);
  $activities: Observable<any>;
  pulseAnimation: boolean = false;

  dateFilterForm = this.formbuilder.group({
    datepicker: [this.datePipe.transform(this.selectedDate, "yyyy-MM-dd")],
  })
    
  formPlatforms: string[] = ["LinkedIn", "Facebook", "Instagram", "TikTok"];
  formSelectedDate = this.datePipe.transform(this.selectedDate, "yyyy-MM-dd"); // get correct format for datepicker
  activitiesForm = this.formbuilder.group({
    weekId: [this.weekId],
    weekIntervalString: [this.createWeekIntervalString(this.selectedDate)],
    platforma: [this.formPlatforms[0]],
    datepicker: [this.formSelectedDate],
    postari: [],
    fam: [],
    intrebareAfacere: [],
    intrebareProdus: [],
    invitatieEvenimentPrezentare: [],
    reply: [],
    da: [],
    nu: [],
    obiectie: [''],
    link: [],
    telefon: [],
    telefonText: [''],
    groups: [],
    groupsText: [''],
    clientiInscriere: [],
    clientiInscriereText: [''],
    followUp: [],
    followUpText: [''],
    ccDeUnde: [],
    ccDeUndeText: [''],
    filter: ['']
  })

  constructor(
    public databaseService: DatabaseService,
    private datePipe: DatePipe,
    private formbuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.$activities = this.getActivities();
  }
 
  getFirstAndLastDayOfWeek(selectedDate) {
    const date = new Date(selectedDate);
    const day = date.getDay(); // get day of week
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // day of month - day of week (-6 if Sunday), otherwise +1
    let firstDay = new Date(date.setDate(diff));
    let lastDay = new Date(firstDay);
    lastDay.setDate(lastDay.getDate() + 6);
    return {firstDay, lastDay};
  }

  createWeekIdString(firstAndLastDayOfWeek: any) {
    return this.datePipe.transform(firstAndLastDayOfWeek.firstDay,"yyyyMMdd") + '-' + this.datePipe.transform(firstAndLastDayOfWeek.lastDay,"yyyyMMdd");
  }

  createWeekIntervalString(selectedDate) {
    const FIRST_DAY_AND_LAST_DAY_OF_WEEK = this.getFirstAndLastDayOfWeek(selectedDate);
    return this.datePipe.transform(FIRST_DAY_AND_LAST_DAY_OF_WEEK.firstDay,"dd.MM.y") + " - " + this.datePipe.transform(FIRST_DAY_AND_LAST_DAY_OF_WEEK.lastDay,"dd.MM.y");
  }

  getActivities() {
    this.firstAndLastDayOfWeek = this.getFirstAndLastDayOfWeek(this.selectedDate);
    this.weekId = this.createWeekIdString(this.firstAndLastDayOfWeek);
    const SPLIT_WEEK_ID = this.weekId.split('-');
    const FILTER = SPLIT_WEEK_ID[0].slice(0, 6) + "," + SPLIT_WEEK_ID[1].slice(0, 6);
    // this.databaseService.getActivities(FILTER).subscribe(res => {
    //   console.log(res);
    // });
    return this.databaseService.getActivities(FILTER);
  }

  // Date Filter form
 
  onFilterDatepickerChange() {
    this.pulseAnimation = true;
    const DATEPICKER = new Date(this.dateFilterForm.controls.datepicker.value);
    this.selectedDate = DATEPICKER;
    this.$activities = this.getActivities();
    this.modalCloseButton2.nativeElement.click(); // close the modal
    setTimeout(() => {this.pulseAnimation = false;}, 1000);
  }
  
  // Activities form

  onPlatformOrDatepickerChange() {
    this.pulseAnimation = true;
    const DATEPICKER = this.activitiesForm.controls.datepicker.value;
    const FIRST_DAY_AND_LAST_DAY_OF_WEEK = this.getFirstAndLastDayOfWeek(DATEPICKER);
    const WEEK_ID = this.createWeekIdString(FIRST_DAY_AND_LAST_DAY_OF_WEEK);
    const WEEK_INTERVAL_STRING = this.createWeekIntervalString(DATEPICKER);
    const PLATFORM = this.activitiesForm.controls.platforma.value;
    const SPLIT_WEEK_ID = WEEK_ID.split('-');
    const FILTER = SPLIT_WEEK_ID[0].slice(0, 6) + "," + SPLIT_WEEK_ID[1].slice(0, 6);

    this.databaseService.getActivity(WEEK_ID + '-' + PLATFORM).subscribe((res: any) => {
      if (res) {
        res.datepicker = this.datePipe.transform(DATEPICKER, "yyyy-MM-dd");
        this.activitiesForm.patchValue(res);
      } else {
        this.resetFormIfNoDataInDb(WEEK_ID, WEEK_INTERVAL_STRING, PLATFORM, DATEPICKER, FILTER);
      }
    });

    setTimeout(() => {this.pulseAnimation = false;}, 1000);
  }

  resetFormIfNoDataInDb(WEEK_ID, WEEK_INTERVAL_STRING, PLATFORM, DATEPICKER, FILTER) {
    this.activitiesForm.setValue({
      weekId: WEEK_ID,
      weekIntervalString: WEEK_INTERVAL_STRING,
      platforma: PLATFORM,
      datepicker: DATEPICKER,
      postari: null,
      fam: null,
      intrebareAfacere: null,
      intrebareProdus: null,
      invitatieEvenimentPrezentare: null,
      reply: null,
      da: null,
      nu: null,
      obiectie: '',
      link: null,
      telefon: null,
      telefonText: '',
      groups: null,
      groupsText: '',
      clientiInscriere: null,
      clientiInscriereText: '',
      followUp: null,
      followUpText: '',
      ccDeUnde: null,
      ccDeUndeText: '',
      filter: FILTER
    });
  }

  activitiesFormSubmit(form) {
    this.databaseService.patchActivities(form)
      .subscribe(res => {
        console.log("saved to db");
        this.modalCloseButton1.nativeElement.click(); // close the modal only if form is valid and submitted;
      });
  }

}
