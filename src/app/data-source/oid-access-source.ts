import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {OidAccessService} from '../service/oid.access.service';
import {catchError, finalize} from 'rxjs/operators';
import {OidAccess} from '../entities/OidAccess';

@Injectable({providedIn: 'root'})
export class OidAccessSource extends DataSource<OidAccess> {

  private getOidAccessSubject = new BehaviorSubject<OidAccess[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public oidAccessPages;
  public loading$ = this.loadingSubject.asObservable();

  constructor(private oidAccessService: OidAccessService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<OidAccess[]> {
    return this.getOidAccessSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.getOidAccessSubject.complete();
    this.loadingSubject.complete();
  }

  getOidAccess(opt: FieldsFilterAccess) {
    this.loadingSubject.next(true);
    this.oidAccessService.setHttpOidAccess(opt.country, opt.gds,
      opt.responsible, opt.department, opt.terminal, opt.pcc,
      opt.activeStatus, opt.sortDirection, opt.sortField, opt.pageNum, opt.pageSize).pipe(
      catchError(() => ([])),
      finalize(() => (this.loadingSubject.next(false)))
    ).subscribe(oidAccess => {
      this.oidAccessPages = oidAccess.totalElements;
      this.getOidAccessSubject.next(oidAccess.content);
    });
  }
}

export class FieldsFilterAccess {
  private _country: string;
  private _gds: string;
  private _responsible: string;
  private _department: string;
  private _terminal: string;
  private _pcc: string;
  private _activeStatus: string;
  private _sortField: string;
  private _sortDirection: string;
  private _pageNum: number;
  private _pageSize: number;


  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }

  get gds(): string {
    return this._gds;
  }

  set gds(value: string) {
    this._gds = value;
  }

  get responsible(): string {
    return this._responsible;
  }

  set responsible(value: string) {
    this._responsible = value;
  }

  get department(): string {
    return this._department;
  }

  set department(value: string) {
    this._department = value;
  }

  get terminal(): string {
    return this._terminal;
  }

  set terminal(value: string) {
    this._terminal = value;
  }

  get pcc(): string {
    return this._pcc;
  }

  set pcc(value: string) {
    this._pcc = value;
  }

  get activeStatus(): string {
    return this._activeStatus;
  }

  set activeStatus(value: string) {
    this._activeStatus = value;
  }

  get sortField(): string {
    return this._sortField;
  }

  set sortField(value: string) {
    this._sortField = value;
  }

  get sortDirection(): string {
    return this._sortDirection;
  }

  set sortDirection(value: string) {
    this._sortDirection = value;
  }

  get pageNum(): number {
    return this._pageNum;
  }

  set pageNum(value: number) {
    if (value === 0) {
      value = 1;
    }
    this._pageNum = value;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    this._pageSize = value;
  }
}
