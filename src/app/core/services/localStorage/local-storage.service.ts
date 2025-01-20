import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private accesstoken = 'jwt_token';
  private refreshtoken = 'refresh_token';
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);


  constructor() { }

  getToken() {
    return localStorage.getItem(this.accesstoken);
  }
  saveToken(token: string) {
    localStorage.setItem(this.accesstoken, token);
    this.tokenSubject.next(token);
  }
  destroyToken() {
    localStorage.removeItem(this.accesstoken);
  }
  getRefresh() {
    return localStorage.getItem(this.refreshtoken);
  }
  saveRefresh(token: string) {
    localStorage.setItem(this.refreshtoken, token);
  }
  destroyRefresh() {
    localStorage.removeItem(this.refreshtoken);
  }
  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }


  get(key: string) {
    return localStorage.getItem(key);
  }
  save(key: string,data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  destroy(key: string) {
    localStorage.removeItem(key);
  }
}
