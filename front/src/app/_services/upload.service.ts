import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AbstractService } from './abstract.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService extends AbstractService {

  constructor(http: HttpClient) {
    super(http, 'upload');
  }

  /**
   * Upload a file
   */
  public upload<T>(formData: FormData): Observable<T> {
    return this.http.post<T>(`${environment.api}/${this.uri}`, formData);
  }
}
