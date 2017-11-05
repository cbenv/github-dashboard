import { Component, OnInit } from '@angular/core';
import { MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-pull-requests',
  templateUrl: './pull-requests.component.html',
  styleUrls: ['./pull-requests.component.scss']
})
export class PullRequestsComponent implements OnInit {

  openPullRequests: PullRequestsDataSource;
  mergedPullRequests: PullRequestsDataSource;
  columns = ['repo', 'title', 'elapsedWeekdays'];

  constructor() { }

  ngOnInit() {
    this.openPullRequests = new PullRequestsDataSource([]);
    this.mergedPullRequests = new PullRequestsDataSource([]);
  }

}

export interface PullRequest {
  repo: string;
  url: string;
  number: number;
  title: string;
  openedAt: string;
  mergedAt: string;
  elapsedWeekdays: number;
  stale: boolean;
}

export class PullRequestsDataSource extends DataSource<PullRequest> {

  constructor(private pullRequests: PullRequest[]) {
    super();
  }

  connect(): Observable<PullRequest[]> {
    return of(this.pullRequests);
  }

  disconnect() {}
}