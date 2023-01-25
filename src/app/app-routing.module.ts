import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './component/clients/clients.component';

const routes: Routes = [
  { path: '', component: ClientsComponent} ,
  { path: 'clients', component: ClientsComponent },
  // { path: '**', component: PageNotFoundComponent },  // Page not found route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})], // {useHash: true} is used for the netlify hosting to work
  exports: [RouterModule]
})
export class AppRoutingModule { }
