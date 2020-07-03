import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {OidDto} from '../entities/OidDto';
import {BehaviorSubject, Observable} from 'rxjs';
import {OidService} from '../service/oid.service';
import {catchError, finalize} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {OidAccessService} from '../service/oid.access.service';


@Injectable({providedIn: 'root'})
export class OidDataSource extends DataSource<OidDto> {

  private oidSubject = new BehaviorSubject<OidDto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public oidPageNum: number;
  public loading$ = this.loadingSubject.asObservable();

  constructor(private userService: OidService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<OidDto[]> {
    return this.oidSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.oidSubject.complete();
    this.loadingSubject.complete();

  }

  loadOids(gds: string, country: string, filter: string, online: string,
           active: string, sort: string, field: string, pageInd: number, pageSze: number) {
    this.loadingSubject.next(true);
    // getOidPage
    this.userService.getOidPage(gds, country, filter, online, active, sort, field, pageInd, pageSze).pipe(
      catchError(() => ([])),
      finalize(() => (this.loadingSubject.next(false))),
    ).subscribe(oids => {
      this.oidPageNum = oids.totalElements;
      this.oidSubject.next(oids.content);
    });
  }

}
