import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  private readonly basePath = environment.apiBaseUrl;
  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  http = inject(HttpClient);

  private handleError(error: any): Observable<never> {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }

  get<T>(path: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http
      .get<T>(`${this.basePath}${path}`, {
        headers: headers || this.defaultHeaders,
        params,
      })
      .pipe(catchError(this.handleError));
  }

  post<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(`${this.basePath}${path}`, body, {
        headers: headers || this.defaultHeaders,
      })
      .pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .put<T>(`${this.basePath}${path}`, body, {
        headers: headers || this.defaultHeaders,
      })
      .pipe(catchError(this.handleError));
  }

  patch<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .patch<T>(`${this.basePath}${path}`, body, {
        headers: headers || this.defaultHeaders,
      })
      .pipe(catchError(this.handleError));
  }

  delete<T>(path: string, headers?: HttpHeaders): Observable<T> {
    return this.http
      .delete<T>(`${this.basePath}${path}`, {
        headers: headers || this.defaultHeaders,
      })
      .pipe(catchError(this.handleError));
  }
}
