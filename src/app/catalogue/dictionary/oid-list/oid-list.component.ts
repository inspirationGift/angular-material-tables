import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {OidService} from '../../../service/oid.service';
import {merge} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MatDialog, MatSort} from '@angular/material';
import {OidDataSource} from '../../../data-source/oid-data-source';
import {EditOidPopUaComponent} from './addons/edit-oid-pop-ua/edit-oid-pop-ua.component';
import {OidDto} from '../../../entities/OidDto';
import {ObservableService, SharedValue} from '../../../service/observable-service';
import {AddPopUpComponent} from './addons/add-pop-up/add-pop-up.component';


@Component({
  selector: 'app-oid-list',
  templateUrl: './oid-list.component.html',
  styleUrls: ['./oid-list.component.scss'],
})
export class OidListComponent implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild(MatPaginator, {static: true}) private paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) private sort: MatSort;

  private oidPost: OidPost = new OidPost();
  private oldOidPost: string;
  private displayedColumns: string[];
  private sortField: string;
  private rowShow: number;
  private rowShowOption: string;

  constructor(private oidService: OidService,
              private dataSource: OidDataSource,
              private dialog: MatDialog,
              private observableService: ObservableService) {
  }

  ngOnInit() {
    this.dataSource = new OidDataSource(this.oidService);
    this.displayedColumns = ['countryCode', 'gdsCode', 'oid', 'type',
      'belong', 'assign', 'status', 'edit'];
    this.sort.disableClear = true;
    this.oldOidPost = '';
    this.sort.direction = 'asc';
    this.paginator.pageIndex = 1;
    this.sortField = this.displayedColumns[0];
    this.rowShow = null;
    this.rowShowOption = null;
    this.setOidPost();
    this.search();

  }

  ngAfterViewInit() {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 1;
      this.sortField = this.sort.active;
    });

    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => {
        this.search(this.oidPost);
      })
    ).subscribe();

  }

  search(val?: OidPost) {
    this.rowShow = null;
    this.rowShowOption = null;
    this.setOidPost(val);
    if (this.oldOidPost !== this.oidPostToString(this.oidPost)) {
      this.dataSource.loadOids(
        this.oidPost.gds,
        this.oidPost.country,
        this.oidPost.reason,
        this.oidPost.onlineType,
        this.oidPost.activeStatus,
        this.oidPost.sortDirection,
        this.oidPost.sortField,
        this.oidPost.pageIndex,
        this.oidPost.pageSize
      );
    }
    this.oldOidPost = this.oidPostToString(this.oidPost);
  }

  setOidPost(val?: OidPost) {
    this.oidPost.gds = !val ? '' : val.gds;
    this.oidPost.country = !val ? '' : val.country;
    this.oidPost.reason = !val ? '' : val.reason;
    this.oidPost.onlineType = !val ? '' : val.onlineType;
    this.oidPost.activeStatus = !val ? 'active' : val.activeStatus;
    this.oidPost.sortField = this.sortField;
    this.oidPost.sortDirection = !this.sort.direction ? 'asc' : this.sort.direction;
    this.oidPost.pageIndex = !this.paginator.pageIndex ? 1 : this.paginator.pageIndex;
    this.oidPost.pageSize = !this.paginator.pageSize ? 10 : this.paginator.pageSize;
  }

  oidPostToString(val?: OidPost): string {
    return val.gds + ' ' +
      val.country + ' ' +
      val.reason + ' ' +
      val.onlineType + ' ' +
      val.activeStatus + ' ' +
      val.sortDirection + ' ' +
      val.sortField + ' ' +
      val.pageIndex.toString() + ' ' +
      val.pageSize.toString();
  }

  openDialogEditOid(oid: OidDto) {
    this.observableService.addToObservableBox(new SharedValue('FromOidToEdit', oid));
    const dialogRef = this.dialog.open(EditOidPopUaComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.observableService.ngOnDestroy();
    });
  }

  openDialogAddOid() {
    const dialogRef = this.dialog.open(AddPopUpComponent);
    dialogRef.afterClosed().subscribe();
  }

  // Expandable dropdown
  open(oid: OidDto, rowId: number, variant: string) {
    // console.log(rowId);
    if (this.rowShow !== rowId) {
      this.rowShowOption = variant;
      this.rowShow = rowId;
    } else {
      this.rowShow = null;
    }
  }

  ngOnDestroy(): void {
  }

}

export class OidPost {
  gds: string;
  country: string;
  reason: string;
  onlineType: string;
  activeStatus: string;
  sortDirection: string;
  sortField: string;
  pageIndex: number;
  pageSize: number;
}

