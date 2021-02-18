import { Injectable, NgZone } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_services/user.service';
import { User } from '../intefaces/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userData: any;
  
  private _hasLoginErr : boolean;
  public get hasLoginErr() : boolean {
    return this._hasLoginErr;
  }

  private _hasRegisterErr : boolean;
  public get hasRegisterErr() : boolean {
    return this._hasLoginErr;
  }

  public loginErr: string;
  public registerErr: string;

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null /*&& user.emailVerified !== false*/) ? true : false;
  }

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth 
    public router: Router,  
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private userService: UserService
  ) {
    this._hasLoginErr = false;
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;

        this.getFromDbUserInfo(
          user.uid,
          { 'userData': JSON.stringify(this.userData) })
          .subscribe(u => {
            let badWayToDoThat: string = JSON.stringify(this.userData);
            let updatedUser: any = JSON.parse(badWayToDoThat);
            updatedUser.displayName = u.displayName;
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }, err => {
            // not db registered user
            localStorage.setItem('user', JSON.stringify(this.userData));
          }
        );
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  public getUserData(): User {
    let user: User = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  private getFromDbUserInfo(uid: string, userdata: any): Observable<User> {
    return this.userService.getOneWithHeader<User>(uid, userdata);
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        let userUID: string = result.user.uid;
        let userdata: any = { 'userData': JSON.stringify(result.user) };
        this.userService.getOneWithHeader<User>(userUID, userdata)
        .subscribe(u => {
          this.SetUserData(result.user, u.displayName);
          this.ngZone.run(() => {
            window.location.reload();
          });
        }, err => {
          this.SetUserData(result.user);
          this.ngZone.run(() => {
            window.location.reload();
          });
          console.log(err);
        });
      }).catch((error) => {
        this._hasLoginErr = true;
        this.loginErr = "You have entered an invalid username or password.";
      });
  }

  // Sign up with email/password
  SignUp(email, password, displayName: string) {
    console.log('displayName', displayName)
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        // this.SendVerificationMail();
        this.SetUserData(result.user, displayName);

        let userdata: any = {
          uid: result.user.uid,
          displayName: displayName,
        }

        this.userService.postWithHeader<User>(
          userdata, 
          { 'userData': JSON.stringify(result.user) }).subscribe(u => {
            console.log('user has been registered in database');
            this.ngZone.run(() => {
              window.location.reload();
            });
          }, err => {
            console.log(err);
          }
        );
      }).catch((error) => {
        console.log('err', error);
        this._hasRegisterErr = true;
        if(error.code === 'auth/email-already-in-use') {
          this.registerErr = error.message;
        } else {
          this.registerErr = "An error occurred while sign up.";
        }
      })
  }

  // update user profile
  UpdateProfile(user: User) {
  }

  // Sign out 
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      window.location.reload();
    })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any, alternativeDisplayName?: string): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: alternativeDisplayName ? alternativeDisplayName : user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

}
