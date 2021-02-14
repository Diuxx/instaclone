import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/Auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // variables
  public search: string;
  public autoCompleteResults: string[];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  /**
   * Check if user is loggedIn
   */
  public isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
}
