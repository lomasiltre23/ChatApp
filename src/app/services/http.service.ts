import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { retry, catchError, map } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiEndpoint = "http://localhost:3000/";
  private options = {};
  constructor(private http: HttpClient) {
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    this.options = {
      headers: headers
    }
  }

  public get(route: string){
    route = this.apiEndpoint + route;
    return this.http.get(route, this.options).pipe(retry(1), catchError(this.errorHandler));
  }

  public post(route: string, body: any){
    route = this.apiEndpoint + route;
    return this.http.post(route, body, this.options).pipe(retry(1), catchError(this.errorHandler));
  } 

  private errorHandler(error) {
    let errorMsg = error.error instanceof ErrorEvent ? error.error.message : `Error Code: ${error.status}\nMessage: ${error.message}`;
    return throwError(errorMsg)
  }
}
