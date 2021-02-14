import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService {

  constructor(http: HttpClient) {
    super(http, 'users');
  }
}
