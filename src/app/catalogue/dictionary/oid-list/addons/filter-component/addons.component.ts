import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {OidPost} from '../../oid-list.component';
import {Dropdown} from '../../../../../data-source/dropdown';
import {CountryIntermediate, Gds, OidReason} from '../../../../../entities/OidDto';
import {Country} from '../../../../../entities/Country';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.scss']
})
export class AddonsComponent implements OnInit {

  private form: FormGroup;

  private oidPost: OidPost = new OidPost();
  @Output('oidPostShare') private oidPostShare = new EventEmitter<OidPost>();
  @Output('add-pop-up') private addPopUp = new EventEmitter<boolean>();
  private countryVal: CountryIntermediate[];
  private gdsVal: Gds[];
  private oidReasons: OidReason[];

  constructor(private dropDown: Dropdown) {
  }

  ngOnInit() {
    this.countryVal = this.dropDown.countryList;
    this.gdsVal = this.dropDown.gdsList;
    this.oidReasons = this.dropDown.oidReasons;

    this.form = new FormGroup({
        gds: new FormControl(),
        country: new FormControl(),
        reason: new FormControl(),
        online: new FormControl(),
        activeStatus: new FormControl()
      }
    );

    this.form.get('activeStatus').setValue('active');

  }

  private submit() {
    this.setOidPostToShare();
    this.sendOidPost(this.oidPost);
  }

  private setOidPostToShare() {
    this.oidPost.gds = this.form.get('gds').value === null ? '' : this.form.get('gds').value;
    this.oidPost.country = this.form.get('country').value === null ? '' : this.form.get('country').value;
    this.oidPost.onlineType = this.form.get('online').value === null ? '' : this.form.get('online').value;
    this.oidPost.reason = this.form.get('reason').value === null ? '' : this.form.get('reason').value;
    this.oidPost.activeStatus = this.form.get('activeStatus').value === null ? '' : this.form.get('activeStatus').value;
    this.oidPost.pageSize = 10;
    this.oidPost.pageIndex = 1;
  }

  private reset() {
    this.form.reset();
    this.countryVal = this.dropDown.countryList;
    this.gdsVal = this.dropDown.gdsList;
    this.setOidPostToShare();
    this.sendOidPost(this.oidPost);
  }

  private sendOidPost(val?: OidPost) {
    this.oidPostShare.emit(val);
  }

  private gdsList() {
    let a: string;
    a = this.form.controls.country.value;
    if (a !== null && a.length === 2) {
      this.gdsVal = this.dropDown.gdsByCountry(a);
      // console.log(this.gdsVal);
    }
  }

  private countryInclude() {
    let a: string;
    a = this.form.controls.country.value;
    this.countryVal = a !== null && a.length > 0 ? this.dropDown.countryIntermediateInclude(a) : this.countryVal;
  }

  private countryList() {
    let a: string;
    a = this.form.controls.gds.value;
    if (a !== null && a.length === 2) {
      this.countryVal = this.dropDown.countryByGds(a);
      // console.log(this.countryVal);
    }
  }

  private gdsInclude() {
    let a: string;
    a = this.form.controls.gds.value;
    this.gdsVal = a !== null && a.length > 0 ? this.dropDown.gdsInclude(a) : this.gdsVal;
  }


  private reasonCheck() {
    let a: string;
    a = this.form.controls.reason.value;
    this.oidReasons = this.dropDown.reasonsIncludes(a);
  }

  popUpNewOid() {
    this.addPopUp.emit();
  }


}
