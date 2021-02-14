import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/Auth.service';
import { FormComponent } from '../form/form.component';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends FormComponent implements OnInit {

  // child event
  @Output() displaySignUpEvent = new EventEmitter<void>();

  constructor(
    formBuilder: FormBuilder,
    authService: AuthService
  ) { 
    super(formBuilder, authService);
    super.formCheckout = this.formBuilder.group({
      login: new FormControl('', [
        Validators.email,
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit() {
  }

  public getPassword(): AbstractControl | null {
    return this.formCheckout.get('password');
  }
  
  public getLogin(): AbstractControl | null {
    return this.formCheckout.get('login');
  }

  public getAuthService(): AuthService {
    return this.authService;
  }

  /**
   * overrided send data
   */
  protected sendData(): void {
    this.authService.SignIn(
      this.formCheckout.value.login,
      this.formCheckout.value.password
    );
  }

  public displaySignUp(): void {
    if(this.displaySignUpEvent.observers.length > 0) { 
      this.displaySignUpEvent.emit();
    }
  }

}
