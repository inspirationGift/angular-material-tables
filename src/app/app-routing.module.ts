import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {MainPageComponent} from './main-page/main-page.component';
import {UserTableComponent} from './catalogue/users/user-table/user-table.component';
import {TableEditableComponent} from './samples/table-editable/table-editable.component';
import {OidListComponent} from './catalogue/dictionary/oid-list/oid-list.component';
import {LookToBookComponent} from './catalogue/dashboard/look-to-book/look-to-book.component';
import {OidAccessComponent} from './catalogue/dictionary/oid-access/oid-access.component';


const routes: Routes = [{
  path: '', component: MainLayoutComponent, children: [
    {path: '', redirectTo: '/', pathMatch: 'full'},
    {path: '', component: MainPageComponent},
    {path: 'admin/users', component: UserTableComponent},
    {path: 'admin/permissions', component: TableEditableComponent},
    {path: 'dictionary/oids', component: OidListComponent},
    {path: 'dictionary/oidaccess', component: OidAccessComponent},
    {path: 'dashboard/l2b', component: LookToBookComponent},

  ],
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
