import { environment } from '../../../../environments/environmentDev';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {LocalStorageService} from "../localStorage/local-storage.service";
import {catchError, shareReplay} from "rxjs/operators";
import {firstValueFrom, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private baseUrl: string = environment.baseUrl;
  private localService: LocalStorageService = inject(LocalStorageService);

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token: string | null = this.localService.getToken();
    return new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }
  getOne(endPoint: string, id: number) {
    const url: string = `${this.baseUrl}/${endPoint}${id}/`;
    return this.http.get<any>(url, {headers: this.getHeaders()}).pipe(catchError(this.handleError));
  }
  getOneWithoutSlash(endPoint: string, id: number) {
    const url: string = `${this.baseUrl}/${endPoint}${id}`;
    return this.http.get<any>(url, {headers: this.getHeaders()}).pipe(catchError(this.handleError));
  }
  getOneWithSlug(endPoint: string, slug: string) {
    const url: string = `${this.baseUrl}/${endPoint}${slug}/`;
    return this.http.get<any>(url, {headers: this.getHeaders()}).pipe(catchError(this.handleError));
  }
  getDetail(basePoint: string, endPoint: string, id: number) {
    const url: string = `${this.baseUrl}/${basePoint}${id}/${endPoint}/`;
    return this.http.get<any>(url, {headers: this.getHeaders()}).pipe(catchError(this.handleError));
  }
  getAll(endPoint: string): Observable<any> {
    const url: string = `${this.baseUrl}/${endPoint}`;
    return this.http.get(url, {headers: this.getHeaders()}).pipe(shareReplay(1), catchError(this.handleError));
  }

  getAllWithoutToken(endPoint: string): Observable<any> {
    const url: string = `${this.baseUrl}/${endPoint}`;
    return this.http.get(url).pipe(shareReplay(1), catchError(this.handleError));
  }
  post(endPoint: string, data: any): Observable<any> {
    const url: string = `${this.baseUrl}/${endPoint}`;
    return this.http.post(url, data, {headers: this.getHeaders()}).pipe(catchError(this.handleError));
  }
  postWithouthHandleError(endPoint:string, data: any): Observable<any>{
    const url: string = `${this.baseUrl}/${endPoint}`;
    return this.http.post(url, data, {headers: this.getHeaders()});
  }
  postWithoutToken(endPoint: string, data: any): Observable<any> {
    const url: string = `${this.baseUrl}/${endPoint}`;
    return this.http.post(url, data).pipe(catchError(this.handleError));
  }

  edit(endPoint: string, id: any, data: any): Observable<any>{
    const url: string = `${this.baseUrl}/${endPoint}${id}/`;
    return this.http.put(url, data, {headers: this.getHeaders()}).pipe(catchError(this.handleError));
  }

  editPartial(endPoint: string, id: any, data: any): Observable<any>{
    const url: string = `${this.baseUrl}/${endPoint}${id}/`;
    return this.http.patch(url, data, {headers: this.getHeaders()}).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage: string = 'Oups ! quelque chose a mal tourné.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.detail;
    } else {
      switch (error.status) {
        case 400: errorMessage = error.error.detail;
          break;
        case 401: errorMessage = error.error.detail;
          break;
        case 402: errorMessage = error.error.detail;
          break;
        case 403: errorMessage = error.error.detail;
          break;
        case 404: errorMessage = error.error.detail;
          break;
        case 500: errorMessage = error.error.detail;
          break;
        default: errorMessage = error.error.detail;
          break;
      }
    }
    return throwError((): Error => new Error(errorMessage))
  }

}
