import { Component, OnInit } from '@angular/core';
import { AppInit } from 'src/app/_core/init/appInit';

// primeng ripple
import { PrimeNGConfig } from 'primeng/api';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'front';
  constructor(
    private initApp: AppInit,
    private primengConfig: PrimeNGConfig,
    private db: AngularFirestore
  ) {
    const things = db.collection('users').valueChanges();
    things.subscribe(console.log);
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    console.log('> (model) | angular template model');
  }
}
