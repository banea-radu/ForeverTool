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
    this.jsonService.getJsonFile().subscribe((importData: any) => {
      this.databaseService.getClients().subscribe((clients) => {
        importData.friends_v2.forEach((newClient) => {

          // find all special characters items to create mapping for replace function
          let hasDiacritics: boolean = false;
          let oldName ='';
          if (newClient.name.includes('\u00c4\u0083')) {
            hasDiacritics = true;
            oldName = newClient.name; // store old name
            this.duplicateIdsArray.push({...newClient, diacritics: hasDiacritics, oldName: 'Ä'});
          }

          let newClientFoundInDb: boolean = false;
          clients.forEach((dbClient) => {
          //   if (newClient.timestamp == dbClient.Id) {
          //     newClientFoundInDb = true;
          //   }
          //   if (newClientFoundInDb) return; // if newClient from json file was found in database, exit current loop and start a new loop
          });
          // if (!newClientFoundInDb) {
          //   // replace all known and mapped special characters (diacritics mostly) with normal characters from json file
          //   let hasDiacritics: boolean = false;
          //   let oldName ='';
          //   if (newClient.name.includes('\u00c4\u0083')) {
          //     hasDiacritics = true;
          //     oldName = newClient.name; // store old name
          //     newClient.name = newClient.name.replaceAll('Ä', 'a');
          //     this.duplicateIdsArray.push({...newClient, diacritics: hasDiacritics, oldName: oldName});
          //   }
          //   if (newClient.name.includes('\u00c3\u00a3')) {
          //     oldName = newClient.name; // store old name
          //     hasDiacritics = true;
          //     // newClient.name = newClient.name.replaceAll('\\u00c3\\u00a3', 'a');
          //     this.duplicateIdsArray.push({...newClient, diacritics: hasDiacritics, oldName: oldName});
          //   }
          // }

        });
        console.log(this.duplicateIdsArray);
      });
    });
  }
  //   - \u00c3\u00a3 : ã
  //   - \u00c4\u0081 : ā
  //   - \u00c3\u00a2 : â
  //   - \u00c3\u00a1 : á
  //   - \u00c4\u0082 : Ă
  //   - \u00c3\u0081 : Á
  //   - \u00c3\u00a9 : é
  //   - \u00c3\u0089 : É
  //   - \u00c3\u00ae : î
  //   - \u00c3\u008e : Î
  //   - \u00c3\u00b6 : ö
  //   - \u00c3\u0096 : Ö
  //   - \u00c8\u0099 : ș
  //   - \u00c5\u009f : ș
  //   - \u00c8\u0098 : Ș
  //   - \u00c5\u009e : Ş
  //   - \u00c8\u009b : ț
  //   - \u00c5\u00a3 : ț
  //   - \u00c5\u00a2 : Ț
  //   - \u00c8\u009a : Ț
  // }
    



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
