import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './component/clients/clients.component';
import { LoginComponent } from './component/login/login.component';
import { ClientsGuardService } from './service/clients-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/clients', pathMatch: 'full' },
  { path: 'clients', component: ClientsComponent, canActivate: [ClientsGuardService] },
  { path: 'login', component: LoginComponent }
  // { path: '**', component: PageNotFoundComponent },  // Page not found route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})], // {useHash: true} is used for the netlify hosting to work
  exports: [RouterModule]
})
export class AppRoutingModule { }
