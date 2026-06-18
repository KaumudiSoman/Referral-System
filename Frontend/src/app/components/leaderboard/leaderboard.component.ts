import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LeaderboardService } from 'src/app/_services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit, OnDestroy {

  leaderboard: any[] = [];
  loading = false;

  globalSearch: string = '';
  filters = {
    surveyName: '',
    referralId: '',
    referrerName: '',
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

    if (this.filters.surveyName)   appliedFilters.surveyName   = this.filters.surveyName;
    if (this.filters.referrerName) appliedFilters.referrerName = this.filters.referrerName;
    if (this.filters.refereeName)  appliedFilters.refereeName  = this.filters.refereeName;
    if (this.filters.status)       appliedFilters.status       = this.filters.status;
    if (this.filters.date)         appliedFilters.date         = this.filters.date;

    if (Object.keys(appliedFilters).length > 0) {
      params.filters = appliedFilters;
    }

    return params;
  }

  updateStatus(item: any, status: any) {
    console.log(item);
    console.log(item.referralId);
    this.leaderBoardService.updateStatus(item.referralId, {status}).subscribe({
      next: () => {this.toastrService.success('Status changed successfully')},
      error: (err) => {this.toastrService.error(err.message)}
    })
  }

  ngOnDestroy(): void {
    this.filterChange$.complete();
  }
}