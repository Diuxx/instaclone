import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { User } from 'src/app/shared/intefaces/User';
import { AuthService } from 'src/app/shared/services/Auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // variables
  isAuth: boolean;
  signInDisplay: boolean = false;
  signUpDisplay: boolean = false;

  constructor(
    public authService: AuthService,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.isAuth = this.authService.isLoggedIn;
    if(!this.isAuth) {
      this.signInDisplay = true ;
    }
  }

  /* display signIn dialog */
  public showSignInDialog(): void {
    if(this.signUpDisplay) {
      this.signUpDisplay = false;
    }
    this.signInDisplay = true;
  }

  /* display signUp dialog */
  public showSignUpDialog(): void {
    if(this.signInDisplay === true) {
      this.signInDisplay = false;
    }
    this.signUpDisplay = true;
  }

  public getUserData(): User {
    return this.authService.getUserData();
  }
}
