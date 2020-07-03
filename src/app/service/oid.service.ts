import {Injectable} from '@angular/core';
import {GdsCountry, OidDto, OidPage, OidReason} from '../entities/OidDto';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {OidEntity} from '../entities/OidEntity';
import {Country} from '../entities/Country';

@Injectable({providedIn: 'root'})
export class OidService {

  private readonly urlOidPage: string;
  private readonly urlOidDto: string;
  private readonly urlGdsCountry: string;
  private readonly urlOidReasons: string;
  private readonly urlOidDelete: string;
  private readonly urlOidEntity: string;
  private readonly urlCountryList: string;
  private readonly urlOidSave: string;

  constructor(private http: HttpClient) {
    this.urlOidPage = `${environment.fbDbUrl}/dictionary/oids`;
    this.urlGdsCountry = `${environment.fbDbUrl}/dictionary/oids/cn`;
    this.urlOidEntity = `${environment.fbDbUrl}/dictionary/oids/entity`;
    this.urlOidReasons = `${environment.fbDbUrl}/dictionary/oids/reason`;
    this.urlOidDto = `${environment.fbDbUrl}/oids`;
    this.urlOidDelete = `${environment.fbDbUrl}/dictionary/oids/update`;
    this.urlCountryList = `${environment.fbDbUrl}/dictionary/countrylist`;

    this.urlOidSave = `${environment.fbDbUrl}/dictionary/oids/save`;


  }

  public getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.urlCountryList);
  }

  public getGdsCountry(): Observable<GdsCountry[]> {
    return this.http.get<GdsCountry[]>(this.urlGdsCountry);
  }

  public getOidEntity(): Observable<OidEntity[]> {
    return this.http.get<OidEntity[]>(this.urlOidEntity);
  }

  public getOidReasons(): Observable<OidReason[]> {
    return this.http.get<OidReason[]>(this.urlOidReasons);
  }


  public getOidDto(): Observable<OidDto[]> {
    return this.http.get<OidDto[]>(this.urlOidDto);
  }


  // //+json parcing
  public getOidPage(gds: string,
                    country: string,
                    reason: string,
                    online: string,
                    active: string,
                    sortOrder = 'asc',
                    field: string,
                    pageNumber = 1,
                    pageSize = 10
  ): Observable<OidPage> {
    return this.http.get<OidPage>(this.urlOidPage, {
      params: new HttpParams()
        .set('gds', (gds))
        .set('country', (country))
        .set('reason', (reason))
        .set('online', (online))
        .set('active', (active))
        .set('sortOrder', sortOrder)
        .set('field', field)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    });
  }

  public deleteOid(oid: OidDto): Observable<boolean> {
    // console.log(this.headers);
    return this.http.post<boolean>(this.urlOidDelete, oid);
  }

  public saveOidDto(oid: OidDto) {
    return this.http.post<boolean>(this.urlOidSave, oid);
  }

}



