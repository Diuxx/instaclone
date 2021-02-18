import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/intefaces/User';

export abstract class AbstractService {

    /**
     * Http service, used to call api
     */
    http: HttpClient;

    // api uri
    uri: string;

    /**
     * Constructor of Abstract service, initializing Http service
     * //@param http
     */
    constructor(http: HttpClient, uri?: string) {
        this.http = http;
        this.uri = uri;
    }

    /**
     * Generate http header with bearer token
     */
    public makeHeader(user: User): HttpHeaders {
        let accessToken: string = user.stsTokenManager?.accessToken;
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'userData': JSON.stringify(user) 
        });
    }

    /**
     * get element with id
     * @param Id 
     */
    public getOne<T>(Id: string | number): Observable<T> {
        return this.http.get<T>(`${environment.api}/${this.uri}/${Id}`);
    }

    /**
     * get element with header set
     */
    public getOneWithHeader<T>(
        Id: string | number, 
        values: { 
            [key: string]: any 
        }): Observable<T> {
        const options = { headers: new HttpHeaders(values) };
        return this.http.get<T>(`${environment.api}/${this.uri}/${Id}`, options);
    }

    /**
     * getAll api function
     */
    public getAll<T>(headers?: HttpHeaders): Observable<T[]> {
        return this.http.get<T[]>(`${environment.api}/${this.uri}`, { headers: headers });
    }

    /**
     * Get all data from uri by adding headers data
     * @param values headers data
     */
    public getAllWithHeader<T>(
        values: { 
            [key: string]: any 
        }): Observable<T[]> {
        const options = { headers: new HttpHeaders(values) };
        return this.http.get<T[]>(`${environment.api}/${this.uri}`, options);
    }

    /**
     * Post a data to api
     * @param data data to send
     */
    public post<T>(data: T, headers?: HttpHeaders): Observable<T> {
        return this.http.post<T>(`${environment.api}/${this.uri}`, data, { headers: headers });
    }

    /**
     * Post a data from uuri & add headers data
     * @param data data to send
     * @param value header content to add
     */
    public postWithHeader<T>(
        data: T, 
        values: { 
            [key: string]: any 
        }): Observable<T> {
        const options = { headers: new HttpHeaders(values) };
        return this.http.post<T>(`${environment.api}/${this.uri}`, data, options);
    }

    /**
     * Delete a data from uri with id
     * @param id id of element to delete
     */
    public delete<T>(id: string, headers?: HttpHeaders): Observable<T> {
        return this.http.delete<T>(`${environment.api}/${this.uri}/${id}`, { headers: headers });
    }

    /**
     * Delete a data from uri with id
     * @param id id of element to delet
     * @param values header content to add
     */
    public deleteWithHeader<T>(
        id: string, 
        values: { 
            [key: string]: any 
        }): Observable<T> {
        const options = { headers: new HttpHeaders(values) };
        return this.http.delete<T>(`${environment.api}/${this.uri}/${id}`, options);
    }

    /**
     * Return options needed for api call
     * @param verb verb to override in call */
    getOptions(verb: string) {
        const options = { headers: new HttpHeaders({ 'X-HTTP-Method-Override': verb }) };
        return options;
    }

    /**
     * Download from a URL.
     * @param downloadUrl the URL to download.
     */
    protected Download(downloadUrl: string): void {
      const iframe = document.getElementById('ifr-download-file') as HTMLIFrameElement;
      iframe.src = downloadUrl;
    }
}
