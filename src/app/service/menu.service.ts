import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuOpened$ = new BehaviorSubject<boolean>(false);
  
  toggleMenu(menuOpened: boolean) {
    this.menuOpened$.next(!menuOpened);
  }

  closeMenuIfOpened(menuOpened: boolean) {
    if (menuOpened) {
      this.toggleMenu(menuOpened);
    }
  }

}
