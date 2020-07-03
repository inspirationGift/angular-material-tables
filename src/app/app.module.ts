import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainPageComponent} from './main-page/main-page.component';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {
  MatDialogModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTableModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './shared/material-module';
import {UserTableComponent} from './catalogue/users/user-table/user-table.component';
import {UserRoleComponent} from './catalogue/users/user-role/user-role.component';
import {HttpClientModule} from '@angular/common/http';
import {TableEditableComponent} from './samples/table-editable/table-editable.component';
import {OidListComponent} from './catalogue/dictionary/oid-list/oid-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddonsComponent} from './catalogue/dictionary/oid-list/addons/filter-component/addons.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {EditOidPopUaComponent} from './catalogue/dictionary/oid-list/addons/edit-oid-pop-ua/edit-oid-pop-ua.component';
import {LookToBookComponent} from './catalogue/dashboard/look-to-book/look-to-book.component';
import {OidAccessComponent} from './catalogue/dictionary/oid-access/oid-access.component';
import {AccessFilterComponent} from './catalogue/dictionary/oid-access/addons/access-filter/access-filter.component';
import {EditAccessComponent} from './catalogue/dictionary/oid-access/addons/edit-access/edit-access.component';
import {AccessDetailsComponent} from './catalogue/dictionary/oid-access/addons/access-details/access-details.component';
import {AccessDeleteComponent} from './catalogue/dictionary/oid-access/addons/access-delete/access-delete.component';
import {AddPopUpComponent} from './catalogue/dictionary/oid-list/addons/add-pop-up/add-pop-up.component';
import { OidDetailsComponent } from './catalogue/dictionary/oid-list/addons/oid-details/oid-details.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    MainLayoutComponent,
    UserTableComponent,
    UserRoleComponent,
    TableEditableComponent,
    OidListComponent,
    AddonsComponent,
    EditOidPopUaComponent,
    LookToBookComponent,
    OidAccessComponent,
    AccessFilterComponent,
    EditAccessComponent,
    AccessDetailsComponent,
    AccessDeleteComponent,
    AddPopUpComponent,
    OidDetailsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [EditOidPopUaComponent, AddPopUpComponent]
})
export class AppModule {
}
