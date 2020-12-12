import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import jwt_decode from "jwt-decode";
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private data: DataService,
    private account: AccountService) { }

  ngOnInit(): void {
    this.data.updateQueryParams();
    if (this.data.jwt != undefined) {
      this.data.ssoSuiteId = this.data.getSsoSuiteId();
    }
    this.data.ssoSuiteJwts = JSON.parse(localStorage.getItem(this.data.ssoSuiteId)) as string[];
    this.data.removeExpiredJwts();
    if (this.data.jwt != undefined) {
      // Renew jwt
      this.account.authenticateSaveJwtRedirect(undefined, undefined, undefined, this.data.jwt)
    } else {
      // Try returning stored jwt(s)
      this.redirectWithExistingJwt();
    }
  }

  login(): void {
    document.querySelector('.log').textContent = '';

    // Ensure required query params are present
    if (this.data.ssoSuiteId == undefined) {
      document.querySelector('.log').textContent = 'The query paremeter "ssoSuiteId" is missing';
      return;
    }
    if (this.data.redirectUrl == undefined) {
      document.querySelector('.log').textContent = 'The query paremeter "redirectUrl" is missing';
      return;
    }

    // Get input
    let userId = document.querySelector('.userId') as HTMLInputElement;
    let password = document.querySelector('.password') as HTMLInputElement;
    let userIdType: string;

    // Validate input
    if (userId.value.length == 0) {
      document.querySelector('.log').textContent = 'The userId field cannot be empty';
      return;
    }
    if (password.value.length == 0) {
      document.querySelector('.log').textContent = 'The password field cannot be empty';
      return;
    }

    // Determine if username or email provided
    if (userId.value.includes('@')) {
      userIdType = "email";
    } else {
      userIdType = "username";
    }

    // Authenticate user, save the response jwt in local storage, and redirect
    this.account.authenticateSaveJwtRedirect(userIdType, userId.value, password.value, undefined);
  }

  redirectWithExistingJwt(): void {
    let jwtToReturn: any;
    if (this.data.ssoSuiteJwts != null) {

      if (this.data.jwtUserId == undefined) {
        jwtToReturn = this.data.ssoSuiteJwts;
      } else {
        this.data.ssoSuiteJwts.forEach(jwt => {
          let jwtClaims: any = jwt_decode(jwt)
          if (jwtClaims.userId == this.data.jwtUserId) {
            jwtToReturn = jwt;
          }
        })
      }
      if (jwtToReturn != undefined) {
        if (this.data.redirectUrl != undefined) {
          let jwtParam: string;
          if (typeof(jwtToReturn) !== 'string') {
            if (jwtToReturn.length == 0) {
              return;
            }
            jwtToReturn = JSON.stringify(jwtToReturn);
            jwtParam = 'jwts';
          } else {
            jwtParam = 'jwt';
          }
          window.location.href = this.data.redirectUrl + '?' + jwtParam + '=' + jwtToReturn;
        } else {
          console.error('The "redirectUrl" query parameter is missing');
        }

      }
    }
  }

}
