import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { filter, map } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-pull-requests',
  templateUrl: './pull-requests.component.html',
  styleUrls: ['./pull-requests.component.scss']
})
export class PullRequestsComponent implements OnInit {

  loading: boolean = false;
  openPullRequests: PullRequestsDataSource;
  mergedPullRequests: PullRequestsDataSource;
  columns: string[] = ['repo', 'title', 'elapsed-weekdays'];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchPullRequests();
  }

  fetchPullRequests() {
    const fetchOpenPullRequests = this.http.get('/api/repos/pull-requests', {
      params: new HttpParams()
        .set('state', 'open')
        .set('sort', 'created')
        .set('direction', 'asc')
    });
    const fetchClosedPullRequests = this.http.get('/api/repos/pull-requests', {
      params: new HttpParams()
        .set('state', 'closed')
        .set('sort', 'created')
        .set('direction', 'desc')
    });
    const onNext = (response) => {
      let [openPullRequests, closedPullRequests] = response;
      openPullRequests = this.parsePullRequests(openPullRequests);
      closedPullRequests = this.parsePullRequests(closedPullRequests);
      this.openPullRequests = new PullRequestsDataSource(openPullRequests);
      this.mergedPullRequests = new PullRequestsDataSource(filter(closedPullRequests, 'mergedAt'));
    };
    const onError = (error) => {
      console.error(error);
    };
    const onCompleted = () => {
      this.loading = false;
    };
    this.loading = true;
    forkJoin([fetchOpenPullRequests, fetchClosedPullRequests]).subscribe(onNext, onError, onCompleted);
  }

  parsePullRequests(pullRequests): PullRequest[] {
    return map(pullRequests, (pullRequest: any) => {
      const openedAt = pullRequest.created_at;
      const mergedAt = pullRequest.merged_at;
      const elapsedWeekdays = this.calculateElapsedWeekdays(openedAt, mergedAt);
      const stale = elapsedWeekdays > 3;
      return {
        repo: pullRequest.base.repo.full_name,
        repoUrl: pullRequest.base.repo.html_url,
        url: pullRequest.html_url,
        number: pullRequest.number,
        title: pullRequest.title,
        openedAt: openedAt,
        mergedAt: mergedAt,
        elapsedWeekdays: elapsedWeekdays,
        stale: stale
      };
    });
  }

  calculateElapsedWeekdays(startDate, endDate): number {
    let start = moment(startDate);
    let end = endDate ? moment(endDate) : moment();
    let numberOfWeekdays = 0;
    
    while (start <= end) {
      if (start.format('ddd') !== 'Sat' && start.format('ddd') !== 'Sun') {
        numberOfWeekdays++;
      }
     start = moment(start).add(1, 'day');
    }
    return numberOfWeekdays;
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