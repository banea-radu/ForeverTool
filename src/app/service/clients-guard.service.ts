import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsGuardService implements CanActivate {

  constructor(
    private databaseService: DatabaseService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.databaseService.isLoggedIn !== true) {
      this.router.navigate(['login'])
    }
    return true;
  }
}