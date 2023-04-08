import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/service/database.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent {
  // create Id from current date
  today: Date = new Date();
  currentYear: number = this.today.getFullYear();
  currentMonth: number = this.today.getMonth() + 1;
  currentMonthString: string = 
    this.currentMonth < 10
      ? '0' + this.currentMonth
      : this.currentMonth.toString();
  currentWeekDay: number = this.today.getDay();
  startOfCurrentWeek: number = (this.currentWeekDay == 0 ? -6 : 1)
    + this.today.getDate() - this.currentWeekDay;
  startOfCurrentWeekString: string =
    this.startOfCurrentWeek < 10
      ? '0' + this.startOfCurrentWeek
      : this.startOfCurrentWeek.toString();
  endOfCurrentWeek: number = this.startOfCurrentWeek + 6;
  endOfCurrentWeekString: string =
    this.endOfCurrentWeek < 10
      ? '0' + this.endOfCurrentWeek
      : this.endOfCurrentWeek.toString();
  thisWeekId: string = this.currentYear + this.currentMonthString + this.startOfCurrentWeekString + this.endOfCurrentWeekString;

  $activities: Observable<any>;

  constructor(
    public databaseService: DatabaseService,
  ) {}

  ngOnInit() {
    this.getActivities();
  }

  getActivities() {
    this.$activities = this.databaseService.getActivities(this.thisWeekId);
  }
}
