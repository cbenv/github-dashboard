import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PullRequestsComponent } from './pull-requests/pull-requests.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/pull-requests',
    pathMatch: 'full'
  },
  {
    path: 'pull-requests',
    component: PullRequestsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
