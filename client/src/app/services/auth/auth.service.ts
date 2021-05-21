import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly http: HttpService
  ) { }


  loginUser(body: any): Observable<any> {
    return this.http.post('/user/login', body);
  }

  registerUser(body: any): Observable<any> {
    return this.http.post('/user/register', body);
  }

  verifyAccount(body: any): Observable<any> {
    return this.http.post('/user/verifyAccount', body);
  }
}
