import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
    public getAll<T>(): Observable<T[]> {
        return this.http.get<T[]>(`${environment.api}/${this.uri}`);
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
    public post<T>(data: T): Observable<T> {
        return this.http.post<T>(`${environment.api}/${this.uri}`, data);
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
    public delete<T>(id: string): Observable<T> {
        return this.http.delete<T>(`${environment.api}/${this.uri}/${id}`);
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
