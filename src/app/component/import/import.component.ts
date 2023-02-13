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
  rawData$: any;
  data: any;

  constructor(private jsonService: JsonService) { }

  ngOnInit() {
    this.rawData$ = this.jsonService.getJsonFile()
      // create new objects with key as id property
      // .pipe(map((response: any) => {
      //   const newObjects = [];
      //   for(const key in response.friends_v2) {
      //     newObjects.push({...response[key], id: key});
      //   }
      //   return newObjects;
      // }))
      .subscribe(data => {console.log(data)});
    // this.jsonService.getJsonFile()
    //   .pipe(
    //     tap(rawData => {
    //     this.rawData = rawData;
    //     })
    //   )
    //   // create new objects with key as id property
    //   .pipe(
    //     map((response: any) => {
    //       // const newObjects = [];
    //       for(const key in response.friends_v2) {
    //         // newObjects.push({...response[key], id: key});
    //         // console.log(key);
    //       }
    //       return response;
    //     })
    //   )
    //   .subscribe(data => {
    //     // this.data = data;
    //     console.log(data.friends_v2);
    //   });
  }
}
