import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIResources } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getAllUsers() {
    return this.http.get(APIResources.baseUrl + APIResources.users);
  }
}
