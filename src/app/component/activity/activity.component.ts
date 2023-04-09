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
  weekId: string;
  $activities: Observable<any>;

  formWeekInterval = this.createWeekIntervalString(this.selectedDate);
  formPlatforms: string[] = ["LinkedIn", "Facebook", "Instagram", "TikTok"];
  formSelectedDate = this.datePipe.transform(this.selectedDate, "yyyy-MM-dd"); // get correct format for datepicker
  activitiesForm = this.formbuilder.group({
    week: [this.formWeekInterval],
    platform: [this.formPlatforms[0]],
    selectedDate: [this.formSelectedDate],
  })

  constructor(
    public databaseService: DatabaseService,
    private datePipe: DatePipe,
    private formbuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.weekId = this.datePipe.transform(this.firstAndLastDayOfWeek.firstDay,"yyyyMMdd") + '-' + this.datePipe.transform(this.firstAndLastDayOfWeek.lastDay,"yyyyMMdd");
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

  createWeekIntervalString(selectedDate) {
    const firstAndLastDayOfWeek = this.getFirstAndLastDayOfWeek(selectedDate);
    this.datePipe.transform(firstAndLastDayOfWeek.firstDay,"dd.MM.y") + " - " + this.datePipe.transform(firstAndLastDayOfWeek.lastDay,"dd.MM.y");
  }

  getActivities(weekId: string) {
    this.$activities = this.databaseService.getActivities(weekId);
  }

  onDatepickerChange(selectedDate) {
    console.log(selectedDate.target.valueAsDate);
    this.selectedDate = selectedDate.target.valueAsDate;
    this.activitiesForm.controls.week.patchValue();
  }

  activitiesFormSubmit(form) {
    console.log("tzushti");
  }
}
