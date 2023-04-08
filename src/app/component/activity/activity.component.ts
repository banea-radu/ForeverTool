import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/service/database.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent {
  // create Id from selected date
  today: Date = new Date("2023-03-30");
  selectedDate: Date = this.today;
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
  
  // selectedYear: number = this.selectedDate.getFullYear();
  // selectedMonth: number = this.selectedDate.getMonth() + 1;
  // selectedMonthString: string = 
  //   this.selectedMonth < 10
  //     ? '0' + this.selectedMonth
  //     : this.selectedMonth.toString();
  // selectedWeekDay: number = this.selectedDate.getDay();
  // startDateOfWeek: number = + this.selectedDate.getDate() - this.selectedWeekDay + (this.selectedWeekDay == 0 ? -6 : 1);
  // startDateOfWeekString: string =
  //   this.startDateOfWeek < 10
  //     ? '0' + this.startDateOfWeek
  //     : this.startDateOfWeek.toString();
  // endDateOfWeek: number = this.startDateOfWeek + 6;
  // endDateOfWeekString: string =
  //   this.endDateOfWeek < 10
  //     ? '0' + this.endDateOfWeek
  //     : this.endDateOfWeek.toString();
  // thisWeekId: string = this.selectedYear + this.selectedMonthString + this.startDateOfWeekString + this.endDateOfWeekString;
  thisWeekId = "2023040309";
 
  $activities: Observable<any>;

  constructor(
    public databaseService: DatabaseService,
  ) {}

  ngOnInit() {
    this.getActivities();
    this.getFirstAndLastDayOfWeek();
    console.log(this.firstDayOfWeek + '' + this.lastDayOfWeek);
  }
  
  getFirstAndLastDayOfWeek() {
    const date = new Date(this.selectedDate);
    const day = date.getDay(); // get day of week
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // day of month - day of week (-6 if Sunday), otherwise +1
    this.firstDayOfWeek = new Date(date.setDate(diff));

    this.lastDayOfWeek = new Date(this.firstDayOfWeek);
    this.lastDayOfWeek.setDate(this.lastDayOfWeek.getDate() + 6);
  }

  getActivities() {
    this.$activities = this.databaseService.getActivities(this.thisWeekId);
  }
}
