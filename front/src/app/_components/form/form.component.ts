import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/Auth.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  // variables
  public formCheckout: FormGroup = null;

  constructor(
    protected formBuilder: FormBuilder,
    protected authService: AuthService,
  ) { 
    this.formCheckout = this.formBuilder.group({});
  }

  ngOnInit() {
  }

  /**
   * submit the formCheckout
   */
  public submit(): void {
    console.log(this.formCheckout.controls)
    if(!this.formCheckout.valid){
      return;
    }
    this.sendData();
  }

  /**
   * check if we can submit the form
   */
  public canSubmit(): boolean {
    return !Object.values(this.formCheckout.controls).some(v => v.errors != null);
  }

  /**
   * This methode must be overrided by component who extend this component.
   */
  protected sendData(): void {
    console.log('sending data...');
    return;
  }
}
