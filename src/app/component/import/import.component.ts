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
      .pipe(map((response: any) => {
        const oldArrayOfObjects = response.friends_v2;
        const newArrayOfObjects = [];
        oldArrayOfObjects.forEach((item, i: number = 0) => {
          let id = item.name + ' - ' + item.timestamp;
          newArrayOfObjects.push({...oldArrayOfObjects[i++], id: id});
        });
        console.log(newArrayOfObjects);
        return response.friends_v2;
      }))
      // .pipe(
      //   tap(response => {
      //     response.forEach((item) => {
      //       let itemCounter = response.filter(x => x.timestamp === item.timestamp).length;
      //       if (itemCounter != 1 ) {
      //         console.log(item.timestamp, itemCounter);
      //       }
      //     });
      //   })
      // )

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
