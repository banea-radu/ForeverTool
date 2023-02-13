import { Component } from '@angular/core';
import { JsonService } from 'src/app/service/json.service';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent {

  rawData: any;
  data: any;

  constructor(private jsonService: JsonService) { }

  ngOnInit() {
    this.jsonService.getJsonFile()
      .pipe(tap(rawData => {
        this.rawData = rawData;
      }))
      .subscribe(data => {
        this.data = data;
      });
  }
}
