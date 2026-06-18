import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIResources } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private http: HttpClient
  ) { }

  register(body: any) {
    return this.http.post(APIResources.baseUrl + APIResources.users + APIResources.register, body);
  }
}
