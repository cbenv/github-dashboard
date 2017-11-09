import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { PullRequestsComponent } from './pull-requests/pull-requests.component';

@NgModule({
  declarations: [
    AppComponent,
    PullRequestsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'github-dashboard'}),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
