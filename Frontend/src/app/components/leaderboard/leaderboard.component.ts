import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ngxCsv } from 'ngx-csv';
import { LeaderboardService } from 'src/app/_services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit, OnDestroy {

  leaderboard: any[] = [];
  metrics: any;
  loading = false;

  globalSearch: string = '';
  filters = {
    surveyId: '',
    surveyName: '',
    referralId: '',
    referrerId: '',
    referrerName: '',
    refereeId: '',
    refereeName: '',
    status: '',
    date: ''
  };

  private filterChange$ = new Subject<void>();

  constructor(
    private toastrService: ToastrService,
    private leaderBoardService: LeaderboardService
  ) {}

  ngOnInit(): void {
    this.filterChange$
      .pipe(
        debounceTime(400),
        switchMap(() => {
          this.loading = true;
          return this.leaderBoardService.getLeaderboard(this.buildParams());
        })
      )
      .subscribe({
        next: (response: any) => {
          this.leaderboard = response.data;
          this.loading = false;
        },
        error: (error) => {
          this.toastrService.error(error.error?.error || error.message);
          this.loading = false;
        }
      });

    // initial load
    this.applyFilters();
    this.getMetrics();
  }

  applyFilters() {
    this.filterChange$.next();
  }

  private buildParams() {
    const params: any = {};

    if (this.globalSearch) {
      params.search = this.globalSearch;
    }

    const appliedFilters: any = {};

    if (this.filters.surveyId)   appliedFilters.surveyId   = this.filters.surveyId;
    if (this.filters.surveyName)   appliedFilters.surveyName   = this.filters.surveyName;
    if (this.filters.referralId) appliedFilters.referralId = this.filters.referralId;
    if (this.filters.referrerId) appliedFilters.referrerId = this.filters.referrerId;
    if (this.filters.referrerName) appliedFilters.referrerName = this.filters.referrerName;
    if (this.filters.refereeId)  appliedFilters.refereeId  = this.filters.refereeId;
    if (this.filters.refereeName)  appliedFilters.refereeName  = this.filters.refereeName;
    if (this.filters.status)       appliedFilters.status       = this.filters.status;
    if (this.filters.date)         appliedFilters.date         = this.filters.date;

    if (Object.keys(appliedFilters).length > 0) {
      params.filters = appliedFilters;
    }

    return params;
  }

  updateStatus(item: any, status: any) {
    this.leaderBoardService.updateStatus(item.referralId, {status}).subscribe({
      next: () => {this.toastrService.success('Status changed successfully')},
      error: (err) => {this.toastrService.error(err.message)}
    })
  }

  getMetrics() {
    this.leaderBoardService.getMetrics().subscribe({
      next: (response: any) => {
        this.metrics = response.data;
      },
      error: (err) => {this.toastrService.error(err.message)}
    })
  }

  exportToCsv() {
    const options = {
      headers: ['Status', 'Survey Id', 'Survey Name', 'Referral Id', 'Referrer Id', 'Referrer Name', 'Referee Id', 'Referre Name', 'Date'],
      title: 'Leaderboard Data'
    };
    new ngxCsv(this.leaderboard, 'referral-report', options);
  }

  ngOnDestroy(): void {
    this.filterChange$.complete();
  }
}