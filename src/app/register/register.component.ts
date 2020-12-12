import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private data: DataService,
    private account: AccountService) { }

  ngOnInit(): void {
    console.log(this.data.ssoSuiteId);
    document.querySelector('button').disabled = false;
    this.data.updateQueryParams();
  }

  register(): void {
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
    let username = document.querySelector('.username') as HTMLInputElement;
    let email = document.querySelector('.email') as HTMLInputElement;
    let password = document.querySelector('.password') as HTMLInputElement;

    // Validate input
    if (username.value.length == 0) {
      document.querySelector('.log').textContent = 'The username field cannot be empty';
      return;
    }
    if (email.value.length == 0) {
      document.querySelector('.log').textContent = 'The email field cannot be empty';
      return;
    }
    if (password.value.length == 0) {
      document.querySelector('.log').textContent = 'The password field cannot be empty';
      return;
    }

    // Create a new user account and perform authentication
    this.account.register(username.value, email.value, password.value);
    document.querySelector('button').disabled = false;

  }

}
