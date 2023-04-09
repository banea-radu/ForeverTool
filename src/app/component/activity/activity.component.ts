import { Component } from '@angular/core';
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
  today: Date = new Date();
  selectedDate: Date = this.today;
  firstAndLastDayOfWeek: any = this.getFirstAndLastDayOfWeek(this.selectedDate); // object that will hold the first day and last day of the week
  // firstDayOfWeek: Date;
  // lastDayOfWeek: Date;
  weekId: string;
  $activities: Observable<any>;

  formWeekInterval = this.datePipe.transform(this.firstAndLastDayOfWeek.firstDay,"dd.MM.y") + " - " + this.datePipe.transform(this.firstAndLastDayOfWeek.lastDay,"dd.MM.y");
  formPlatforms: string[] = ["LinkedIn", "Facebook", "Instagram", "TikTok"];
  formSelectedDate = this.datePipe.transform(this.selectedDate, "yyyy-MM-dd"); // get correct format for datepicker
  activitiesForm = this.formbuilder.group({
    week: [this.formWeekInterval],
    platform: [this.formPlatforms[0]],
    selectedDate: [this.formSelectedDate],    
    // problemOrNeed: [""],
    // child: [""],
    // volunteer: [""]
  })

  constructor(
    public databaseService: DatabaseService,
    private datePipe: DatePipe,
    private formbuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.weekId = this.datePipe.transform(this.firstAndLastDayOfWeek.firstDay,"yyyyMMdd") + '-' + this.datePipe.transform(this.firstAndLastDayOfWeek.lastDay,"yyyyMMdd");
    this.getActivities();
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

  getActivities() {
    this.$activities = this.databaseService.getActivities(this.weekId);
  }

  activitiesFormSubmit(form) {
    // this.addNewFormSubmitted = true;
    // const TIMESTAMP = new Date().getTime();
    // const USERNAME = this.userName.replaceAll(" ", "");
    // const DATABASE_UID = 9999999999999 - TIMESTAMP + "-" + USERNAME; // substract TIMESTAMP from 99.. number so i get a new number in a descending order in the database
    // if (this.activitiesForm.valid) {
      // const stringToDate = new Date(form.activityDate);
      // const stringToNumber = Number(form.duration);
      // form.activityDate = stringToDate;
      // form.duration = stringToNumber;
      // form.dateAdded = TIMESTAMP;
      // this.databaseService.addActivity(form, DATABASE_UID)
      //   .subscribe(res => {
      //     console.log('saved to db');
      //     this.getAllActivities();
      //     this.modalCloseButton1.nativeElement.click(); // close the modal only if form is valid and submitted
      //   });
      // console.log("valid");
    // }

    const test = this.getFirstAndLastDayOfWeek(form.selectedDate);
    console.log(this.datePipe.transform(test.firstDay,"dd.MM.y") + " - " + this.datePipe.transform(test.lastDay,"dd.MM.y"));
  }
}
