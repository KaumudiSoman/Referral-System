import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIResources } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(
    private http: HttpClient
  ) { }

  getLeaderboard(body: any) {
    return this.http.post(APIResources.baseUrl + APIResources.leaderboard, body);
  }

  updateStatus(referralId: any, body: any) {
    return this.http.put(APIResources.baseUrl + APIResources.referrals + `/${referralId}`, body);
  }
}
