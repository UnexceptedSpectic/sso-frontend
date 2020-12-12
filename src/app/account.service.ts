import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})

const ssoApi: string = 'http://auth.libredelibre.com:8080';

export class AccountService {

  constructor(
    private http: HttpClient,
    private data: DataService) { }

  register(username: string, email: string, password: string): void {
    document.querySelector('button').disabled = true;

    this.http.post(
      ssoApi + '/account/create',
      {'username': username, 'email': email, 'password': password},
      {headers: new HttpHeaders({'Content-Type': 'application/json'})})
    .pipe(
      catchError(err => {
        document.querySelector('.log').textContent = err.error.error;
        return of([]);
      })
    )
    .subscribe((res: any) => {
      if (res.length != 0) {
        document.querySelector('.log').textContent = 'Redirecting...please wait'
        this.authenticateSaveJwtRedirect('username', username, password, undefined);
      }
    });

  }

  authenticateSaveJwtRedirect(userIdType: string, userId: string, password: string, jwt: string): void {
    document.querySelector('button').disabled = true;

    let body;
    // when a jwt is provided, jwt renewal is performed
    if (jwt != undefined) {
      body = {
        jwt: jwt,
        renew: true}
    } else {
      body = {
        [userIdType]: userId,
        'password': password,
        'ssoSuiteId': this.data.ssoSuiteId}
    }

    this.http.post(
      ssoApi + '/account/authenticate', body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
    })
    .pipe(
      catchError(err => {
        document.querySelector('.log').textContent = err.error.error;
        document.querySelector('button').disabled = false;
        return of([]);
      })
    )
    .subscribe((res: any) => {
      if (res.jwt != undefined) {
        if (this.data.ssoSuiteJwts == null) {
          this.data.ssoSuiteJwts = [];
        }
        if (!this.data.ssoSuiteJwts.includes(res.jwt)) {
          // ensures that the latest login/jwt renewal will be at the end of the array
          this.data.ssoSuiteJwts = this.data.ssoSuiteJwts.filter(jwt => jwt != res.jwt)
          this.data.ssoSuiteJwts.push(res.jwt)
        }
        localStorage.setItem(this.data.ssoSuiteId, JSON.stringify(this.data.ssoSuiteJwts));
        window.location.href = this.data.redirectUrl + '?jwt=' + res.jwt;
      }
    });

  }

  signOut(jwt: string): void {

    this.http.post(
      ssoApi + '/account/signOut',
      {'jwt': jwt},
      {headers: new HttpHeaders({'Content-Type': 'application/json'})})
    .pipe(
      catchError(err => {
        console.log(err.error.error);
        return of([]);
      })
    )
    .subscribe((res: any) => {
      if (res.length != 0) {
        if (this.data.ssoSuiteJwts == null) {
          this.data.ssoSuiteJwts = [];
        }
        // Remove jwt
        let jwtIndex = this.data.ssoSuiteJwts.indexOf(jwt);
        if (jwtIndex > -1) {
          this.data.ssoSuiteJwts.splice(jwtIndex, 1);
          localStorage.setItem(this.data.ssoSuiteId, JSON.stringify(this.data.ssoSuiteJwts));
        }
        window.location.href = this.data.redirectUrl;
      }
    });

  }

}
