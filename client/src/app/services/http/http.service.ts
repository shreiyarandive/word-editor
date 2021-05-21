import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  get(path: string): Observable<any> {
    return this.http.get(`${environment.hostURL}${path}`);
  }

  post(path: string, body: any): Observable<any>{
    return this.http.post(`${environment.hostURL}${path}`, body);
  }
}
