import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private data: DataService,
    private account: AccountService) { }

  ngOnInit(): void {
    this.data.updateQueryParams();
    if (this.data.redirectUrl == undefined) {
      document.querySelector('p').textContent = 'No "redirectUrl" query parameter provided';
    } else {
      this.data.ssoSuiteId = this.data.getSsoSuiteId();
      this.data.ssoSuiteJwts = JSON.parse(localStorage.getItem(this.data.ssoSuiteId)) as string[];
      this.account.signOut(this.data.jwt);
    }
  }

}
