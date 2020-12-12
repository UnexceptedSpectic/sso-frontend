import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Param variables
  ssoSuiteId: string;
  redirectUrl: string;
  jwtUserId: string;
  jwt: string;

  // Generated variables
  ssoSuiteJwts: string[]

  constructor(private route: ActivatedRoute) { }

  updateQueryParams() {
    this.route.queryParams
      .subscribe(params => {
        if (this.ssoSuiteId == undefined) {
          this.ssoSuiteId = params.ssoSuiteId;
        }
        if (this.redirectUrl == undefined) {
          this.redirectUrl = params.redirectUrl;
        }
        if (this.jwtUserId == undefined) {
          this.jwtUserId = params.jwtUserId;
        }
        if (this.jwt == undefined) {
          this.jwt = params.jwt;
        }
      });
  }

  getSsoSuiteId(): string {
    let jwtPayload = jwt_decode(this.jwt) as any;
    return jwtPayload.ssoSuiteId
  }

  removeExpiredJwts(): void {
    this.ssoSuiteJwts = this.ssoSuiteJwts.filter(jwt => !this.isExpired(jwt));
  }

  isExpired(jwt: string): boolean {
    return Number(JSON.parse(atob(jwt.split('.')[1])).exp) < Math.round(Date.now() / 1000);
  }

}
