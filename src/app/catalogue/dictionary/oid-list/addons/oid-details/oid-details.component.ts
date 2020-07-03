import {Component, Input, OnInit} from '@angular/core';
import {OidDto} from '../../../../../entities/OidDto';
import {ObservableService, SharedValue} from '../../../../../service/observable-service';
import {Router} from '@angular/router';
import {OidAccessService} from '../../../../../service/oid.access.service';

@Component({
  selector: 'app-oid-details',
  templateUrl: './oid-details.component.html',
  styleUrls: ['./oid-details.component.scss']
})
export class OidDetailsComponent implements OnInit {

  @Input('oid') private oid: OidDto;

  constructor(private observableService: ObservableService,
              private oidAccess: OidAccessService,
              private route: Router) {
  }

  ngOnInit() {
    this.oidAccess.setHttpOidAccess();
  }

  openAccessDetails() {
    this.observableService.addToObservableBox(new SharedValue('fromOidToAccess', this.oid.oid));
    this.route.navigateByUrl('/dictionary/oidaccess').then();
  }
}
