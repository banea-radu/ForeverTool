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
  today: Date = new Date();
  selectedDate: Date = this.today;
  firstAndLastDayOfWeek: any = this.getFirstAndLastDayOfWeek(this.selectedDate); // object that will hold the first day and last day of the week
  weekId: string = this.createWeekIdString(this.firstAndLastDayOfWeek);
  $activities: Observable<any>;
  pulseAnimation: boolean = false;

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
  })

  constructor(
    public databaseService: DatabaseService,
    private datePipe: DatePipe,
    private formbuilder: FormBuilder,
  ) {}

  ngOnInit() {
    console.log(this.weekId);
    this.getActivities(this.weekId);
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

  getActivities(weekId: string) {
    this.$activities = this.databaseService.getActivities(weekId);
  }

  onDatepickerChange(datepickerDate) {
    this.pulseAnimation = true;
    const DATEPICKER_DATE = datepickerDate.target.valueAsDate;
    const FIRST_DAY_AND_LAST_DAY_OF_WEEK = this.getFirstAndLastDayOfWeek(DATEPICKER_DATE);
    this.activitiesForm.patchValue({
      weekId: this.createWeekIdString(FIRST_DAY_AND_LAST_DAY_OF_WEEK),
      weekIntervalString: this.createWeekIntervalString(DATEPICKER_DATE)
    });
    setTimeout(() => {this.pulseAnimation = false;}, 1000);
  }

  activitiesFormSubmit(form) {
    this.databaseService.patchActivities(form)
      .subscribe(res => {
        console.log("saved to db");
        this.modalCloseButton1.nativeElement.click(); // close the modal only if form is valid and submitted;
      });
  }
}
