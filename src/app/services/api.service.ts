import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient) {}

    private formatErrors(error: any) {
        return throwError(() => error.error);
    }

    get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
        return this.http
            .get<T>(`${environment.apiUrl}${path}`, { params })
            .pipe(catchError(this.formatErrors));
    }

    put<T>(path: string, body: any = {}, headers:any): Observable<T> {
        return this.http
            .put<T>(`${environment.apiUrl}${path}`, JSON.stringify(body), {headers: headers})
            .pipe(catchError(this.formatErrors));
    }

    post<T>(path: string, body: any = {}, headers:any): Observable<T> {
        return this.http
            .post<T>(`${environment.apiUrl}${path}`, JSON.stringify(body), {headers: headers})
            .pipe(catchError(this.formatErrors));
    }

    delete<T>(path: string): Observable<T> {
        return this.http
            .delete<T>(`${environment.apiUrl}${path}`)
            .pipe(catchError(this.formatErrors));
    }
}
