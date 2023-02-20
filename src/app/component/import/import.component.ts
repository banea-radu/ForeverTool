import { Component } from '@angular/core';
import { JsonService } from 'src/app/service/json.service';
import { tap, map } from 'rxjs/operators';
import { DatabaseService } from 'src/app/service/database.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent {

  // rawData: any;
  importData$: any;
  duplicateIdsArray: any[] = [];
  // data: any;
  startDate = new Date(1263722547*1000);
  startDayMonthYear = this.startDate.getDate() + '.' + (this.startDate.getMonth() + 1) + '.' + this.startDate.getFullYear();
  endDate = new Date(1675285130*1000);
  endDayMonthYear = this.endDate.getDate() + '.' + (this.startDate.getMonth() + 1) + '.' + this.endDate.getFullYear();
  clientIdsFromDatabase: any;

  constructor(
    private jsonService: JsonService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    this.importFromFacebook();
  }

  importFromFacebook() {
    this.jsonService.getJsonFile().subscribe((importData: any) => {
      this.databaseService.getClients().subscribe((clients) => {
        importData.friends_v2.forEach((newClient) => {
          // replace all (known) special characters from the imported json file
          newClient.name = newClient.name.replaceAll('\u00c4\u0083', 'a'); // ă => a
          newClient.name = newClient.name.replaceAll('\u00c3\u00a3', 'a'); // ã => a
          newClient.name = newClient.name.replaceAll('\u00c4\u0081', 'a'); // ā => a
          newClient.name = newClient.name.replaceAll('\u00c3\u00a2', 'a'); // â => a
          newClient.name = newClient.name.replaceAll('\u00c3\u00a1', 'a'); // á => a
          newClient.name = newClient.name.replaceAll('\u00c4\u0082', 'A'); // Ă => A
          newClient.name = newClient.name.replaceAll('\u00c3\u0081', 'A'); // Á => A
          newClient.name = newClient.name.replaceAll('\u00c3\u00a9', 'e'); // é => e
          newClient.name = newClient.name.replaceAll('\u00c3\u0089', 'E'); // É => E
          newClient.name = newClient.name.replaceAll('\u00c3\u00ae', 'i'); // î => i
          newClient.name = newClient.name.replaceAll('\u00c3\u008e', 'I'); // Î => I
          newClient.name = newClient.name.replaceAll('\u00c3\u00b6', 'o'); // ö => o
          newClient.name = newClient.name.replaceAll('\u00c3\u0096', 'O'); // Ö => O
          newClient.name = newClient.name.replaceAll('\u00c8\u0099', 's'); // ș => s
          newClient.name = newClient.name.replaceAll('\u00c5\u009f', 's'); // ș => s
          newClient.name = newClient.name.replaceAll('\u00c8\u0098', 'S'); // Ș => S
          newClient.name = newClient.name.replaceAll('\u00c5\u009e', 'S'); // Ş => S
          newClient.name = newClient.name.replaceAll('\u00c8\u009b', 't'); // ț => t
          newClient.name = newClient.name.replaceAll('\u00c5\u00a3', 't'); // ț => t
          newClient.name = newClient.name.replaceAll('\u00c5\u00a2', 'T'); // Ț => T
          newClient.name = newClient.name.replaceAll('\u00c8\u009a', 'T'); // Ț => T
          // search if newClient from imported json file already exists in database
          let newClientAlreadyInDb: boolean = false;
          clients.forEach((dbClient) => {
            if (newClient.timestamp == dbClient.Id) {
              newClientAlreadyInDb = true;
              return; // if newClient from json file already exists in database, exit current loop
            }
          });
          // if newClient from json file was not found in database:
          if (!newClientAlreadyInDb) {

            // add source of imported file property
            
            this.duplicateIdsArray.push({...newClient});
          }
        });
        console.log(this.duplicateIdsArray);
      });
    });
  }
    



      // .pipe(map((response: any) => {
      //           //   const oldArrayOfObjects = response.friends_v2;
      //           //   const newArrayOfObjects = [];
      //           //   oldArrayOfObjects.forEach((item, i: number = 0) => {
      //           //     let id = item.timestamp;
      //           //     newArrayOfObjects.push({...oldArrayOfObjects[i++], id: id});
      //           //   });
      //           //   console.log(newArrayOfObjects);
      //   return response.friends_v2;
      // }))
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
