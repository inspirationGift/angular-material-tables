import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {OidAccess} from '../entities/OidAccess';
import {OidAccessResponsible} from '../entities/OidAccessResponsible';


@Injectable({providedIn: 'root'})
export class OidAccessService {

  private readonly urlGetOidAccess: string;
  private readonly urlSelectAllResponsible: string;


  constructor(private http: HttpClient) {
    this.urlGetOidAccess = `${environment.fbDbUrl}/dictionary/oids/access`;
    this.urlSelectAllResponsible = `${environment.fbDbUrl}dictionary/oids/access/responsible`;


  }

  public setHttpOidAccess(
    country = '',
    gds = '',
    responsible = '',
    department = '',
    terminal = '',
    pcc = '',
    activeStatus = '',
    sortOrder = 'acs',
    sortField = '',
    pageNumber = 1,
    pageSize = 10
  ): Observable<OidAccess[]> {
    return this.http.get<OidAccess[]>(this.urlGetOidAccess, {
      params: new HttpParams()
        .set('country', country)
        .set('gds', gds)
        .set('responsible', responsible)
        .set('department', department)
        .set('terminal', terminal)
        .set('pcc', pcc)
        .set('activeStatus', activeStatus)
        .set('sortOrder', sortOrder)
        .set('sortField', sortField)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    });
  }

  public getAllResponsible(): Observable<OidAccessResponsible[]> {
    return this.http.get<OidAccessResponsible[]>(this.urlSelectAllResponsible);
  }

}
