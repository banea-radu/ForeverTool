import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/service/database.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent {
  clientsToAddToDb: any = {};
  keysClientsToAddToDb: String[];
  // startDate = new Date(1263722547*1000);
  // startDayMonthYear = this.startDate.getDate() + '.' + (this.startDate.getMonth() + 1) + '.' + this.startDate.getFullYear();
  // endDate = new Date(1675285130*1000);
  // endDayMonthYear = this.endDate.getDate() + '.' + (this.startDate.getMonth() + 1) + '.' + this.endDate.getFullYear();

  constructor(
    private databaseService: DatabaseService
  ) { }

  fileImport(event, source: string) {
    const file: File = event.target.files[0];
    // check if file is '.json'
    if (file.type !== 'application/json') {
      alert('Fisierul importat nu are extensia ".json" !')
      return;
    }

    const fileReader: FileReader = new FileReader();
    const _this = this; // create constant with correct 'this.'
    fileReader.readAsText(file);
    fileReader.onloadend = function(file) {
      const sourceObject = JSON.parse(fileReader.result as string);
      // facebook source:
      if (source === 'facebook') {
        // check if json file has the correct key 'friends_v2'
        if (sourceObject.friends_v2) {
          _this.importFromFacebook(sourceObject.friends_v2);
        } else {
          alert('Fisierul importat nu are formatul de facebook corect!')
          return;
        }
      }
      // Clear the input
      event.target.value = null;
    }
  }

  importFromFacebook(importData: any) {
    this.databaseService.getClients().subscribe((clients) => {
      importData.forEach((newClient) => {
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
      
        // if newClient from json file was not found in database, then save it in the 'clientsToAddToDb' object that will be imported
        if (!newClientAlreadyInDb) {
          // create object with created keys and add source of imported file property
          let keyName = newClient.name.substring(0, 2) + '-' + newClient.timestamp;
          this.clientsToAddToDb[keyName] = {Nume: newClient.name, Id: newClient.timestamp, source: 'facebook'};
        }
      });

      // import all new clients in database
      this.databaseService.importNewClients(this.clientsToAddToDb).subscribe(() => {
        this.keysClientsToAddToDb = Object.keys(this.clientsToAddToDb);
        alert(`Au fost adaugati ${this.keysClientsToAddToDb.length} clienti noi! Sunt afisati in tabel!`);
        // empty object so that the next file import will be 'fresh'
        this.clientsToAddToDb = {};
      });
    });
  }
}
