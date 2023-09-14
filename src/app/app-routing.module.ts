import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  { path: 'login', component: HomepageComponent},
  { path: '', component: FeedComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
