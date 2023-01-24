import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { MenuService } from 'src/app/service/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuOpened: boolean = false;

  constructor(
    private menuService: MenuService,
    private viewportScroller: ViewportScroller
  ) {}
    
  ngOnInit() {
    this.menuService.menuOpened$.subscribe((response: boolean) => {
      this.menuOpened = response;
    });
  }
  
  toggleMenu() {
    this.menuService.toggleMenu(this.menuOpened);
  }

  closeMenuIfOpened() {
      this.menuService.closeMenuIfOpened(this.menuOpened);
      this.scrollToTop();
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

}