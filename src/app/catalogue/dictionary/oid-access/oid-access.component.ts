import {
    AfterViewInit, Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatSort} from '@angular/material';
import {ObservableService} from '../../../service/observable-service';
import {OidAccessService} from '../../../service/oid.access.service';
import {FieldsFilterAccess, OidAccessSource} from '../../../data-source/oid-access-source';
import {EditAccessComponent} from './addons/edit-access/edit-access.component';
import {merge} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AccessDetailsComponent} from './addons/access-details/access-details.component';
import {AccessDeleteComponent} from './addons/access-delete/access-delete.component';
import {OidDto} from '../../../entities/OidDto';

@Component({
    selector: 'app-oid-access',
    templateUrl: './oid-access.component.html',
    styleUrls: ['./oid-access.component.scss'],
    entryComponents: [EditAccessComponent, AccessDetailsComponent, AccessDeleteComponent]
})
export class OidAccessComponent implements OnInit, AfterViewInit {

    private displayedColumns: string[];
    private fieldName: string;

    @ViewChild(MatPaginator, {static: true}) private paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) private sort: MatSort;
    private fieldToPost: FieldsFilterAccess;

    private rowShow: number;
    private check: string;
    private rowShowOption: string;

    constructor(private oidAccessService: OidAccessService,
                private dataSource: OidAccessSource,
                private dialog: MatDialog,
                private observableService: ObservableService) {
    }

    ngOnInit() {

        this.setDefault();
        // if pcc comes from OidComponent
        this.observableService.inventoryChanged$.subscribe(value => {
            if (value && value.name.toString() === 'fromOidToAccess') {
                this.fieldToPost.pcc = value.value;
            }
        });
        this.search(this.fieldToPost);
    }

    ngAfterViewInit() {
        // reset the paginator after sorting
        this.sort.sortChange.subscribe(() => {
            this.fieldName = this.sort.active;
        });

        merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize).pipe(
            tap(() => {
                this.search(this.fieldToPost);
            })
        ).subscribe();

    }

    private open(oid: OidDto, rowId: number, variant: string) {
        // console.log(rowId);
        if (this.rowShow !== rowId) {
            this.rowShowOption = variant;
            this.rowShow = rowId;
        } else {
            this.rowShowOption = null;
            this.rowShow = null;
        }
    }

    private search(val: FieldsFilterAccess) {

        this.setParameters(val);

        if (this.check !== this.newRequest(this.fieldToPost)) {
            this.dataSource.getOidAccess(this.fieldToPost);
        }
        this.check = this.newRequest(this.fieldToPost);
    }

    private setParameters(val?: FieldsFilterAccess) {

        this.fieldToPost.terminal = val.terminal;
        this.fieldToPost.pcc = val.pcc;
        this.fieldToPost.activeStatus = val.activeStatus;
        this.fieldToPost.country = val.country;
        this.fieldToPost.gds = val.gds;
        this.fieldToPost.responsible = val.responsible;
        this.fieldToPost.department = val.department;
        this.fieldToPost.sortField = this.fieldName;
        this.fieldToPost.sortDirection = this.sort.direction;
        this.fieldToPost.pageNum = this.paginator.pageIndex;
        this.fieldToPost.pageSize = this.paginator.pageSize;
    }

    private setDefault() {
        this.dataSource = new OidAccessSource(this.oidAccessService);
        this.fieldToPost = new FieldsFilterAccess();
        this.displayedColumns = ['id', 'countryCode', 'gdsCode', 'oid', 'terminal',
            'statusActive', 'responsible', 'department', 'description', 'action'];
        this.fieldName = this.displayedColumns[1];
        this.check = '';
        this.sort.direction = 'asc';
        this.paginator.pageIndex = 1;
        this.paginator.pageSize = 10;
        // Field to post def
        this.fieldToPost.terminal = 'any';
        this.fieldToPost.pcc = 'any';
        this.fieldToPost.activeStatus = 'active';
        this.fieldToPost.country = 'any';
        this.fieldToPost.gds = 'any';
        this.fieldToPost.responsible = 'any';
        this.fieldToPost.department = 'any';
        this.fieldToPost.sortField = this.fieldName;
        this.fieldToPost.sortDirection = 'asc';
        this.fieldToPost.pageNum = this.paginator.pageIndex;
        this.fieldToPost.pageSize = this.paginator.pageSize;
    }

    private newRequest(val: FieldsFilterAccess): string {
        return this.fieldToPost.country + ' ' +
            this.fieldToPost.gds + ' ' +
            this.fieldToPost.responsible + ' ' +
            this.fieldToPost.department + ' ' +
            this.fieldToPost.terminal + ' ' +
            this.fieldToPost.pcc + ' ' +
            this.fieldToPost.activeStatus + ' ' +
            this.fieldToPost.sortDirection + ' ' +
            this.fieldToPost.sortField + ' ' +
            this.fieldToPost.pageNum + ' ' +
            this.fieldToPost.pageSize;
    }

    private collapse() {
        this.rowShowOption = null;
        this.rowShow = null;
    }


}





