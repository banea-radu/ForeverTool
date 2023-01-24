import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { ProspectiComponent } from './component/prospecti/prospecti.component';

const routes: Routes = [
  { path: '', component: HomeComponent} ,
  { path: 'home', component: HomeComponent },
  { path: 'prospecti', component: ProspectiComponent },
  // { path: '**', component: PageNotFoundComponent },  // Page not found route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})], // {useHash: true} is used for the netlify hosting to work
  exports: [RouterModule]
})
export class AppRoutingModule { }
