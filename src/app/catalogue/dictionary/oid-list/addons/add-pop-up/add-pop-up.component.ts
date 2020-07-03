import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Dropdown} from '../../../../../data-source/dropdown';
import {Gds, OidDto, OidReason} from '../../../../../entities/OidDto';
import {OidEntity} from '../../../../../entities/OidEntity';
import {Country} from '../../../../../entities/Country';
import {OidService} from '../../../../../service/oid.service';
import {Subscription} from 'rxjs';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add-pop-up',
  templateUrl: './add-pop-up.component.html',
  styleUrls: ['./add-pop-up.component.scss']
})
export class AddPopUpComponent implements OnInit {
  private form: FormGroup;
  private toggle: boolean;
  private status = [];
  private gdsVal: Gds[];
  private countryVal: Country[] = [];
  private reasonVal: OidReason[];
  private oidEntityVal: OidEntity[];
  private oid: OidDto;
  private message: string;

  constructor(private dropDown: Dropdown,
              private oidService: OidService,
              private matDialogRef: MatDialogRef<AddPopUpComponent>) {
  }

  ngOnInit() {
    this.toggle = false;
    this.message = null;
    this.gdsVal = this.dropDown.gdsList;
    this.countryVal = this.dropDown.geoCountry;
    this.reasonVal = this.dropDown.oidReasons;
    this.oidEntityVal = this.dropDown.oidEntity;
    this.status = this.dropDown.activeStatus.filter(value => {
      if (value.opt !== 'any') {
        return value;
      }
    });

    this.form = new FormGroup({
      gds: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9]{2}')

      ]),
      gdsName: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Zа-яА-Я0-9 -]*'),
        Validators.minLength(3),
        Validators.maxLength(15)
      ]),
      country: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]{2}')
      ]),
      countryName: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z -]*'),
        Validators.minLength(3),
        Validators.maxLength(20)
      ]),
      pcc: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Zа-яА-Я0-9]*'),
        Validators.minLength(3),
        Validators.maxLength(15)
      ]),
      iata: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(5),
        Validators.pattern('[a-zA-Z0-9]*')
      ]),
      online: new FormControl(1, [
        Validators.required
      ]),
      status: new FormControl('', [
        Validators.required
      ]),
      belong: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]*')
      ]),
      assign: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]*')
      ]),
      reason: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z. -]*')
      ]),
      comment: new FormControl('')
    });

    this.formDefault();

  }

  submit() {

    let gds: Gds;
    let country: Country;
    let formValue: {
      iata: string, belong: string,
      assign: string, online: number, status: string, reason: string,
      country: string, countryName: string, gds: string, gdsName: string, comment: string, pcc: string
    };

    formValue = this.form.getRawValue();
    gds = this.dropDown.getGdsByCode(formValue.gds);
    country = this.dropDown.getCountryByCode(formValue.country);

    if (country !== null) {
      this.form.patchValue({countryName: country.countryName});
    }

    if (gds !== null) {
      this.form.patchValue({gdsName: gds.gdsName});
    }

    if (!this.form.invalid) {

      formValue = this.form.getRawValue();
      this.oid = new OidDto();
      this.oid.oid = formValue.pcc.toUpperCase();
      this.oid.iata = formValue.iata.toUpperCase();
      this.oid.type = formValue.online;
      this.oid.status = this.dropDown.getStatusId(formValue.status);
      this.oid.statusName = formValue.status;
      this.oid.gds = gds !== null ? gds.id : -1;
      this.oid.gdsCode = formValue.gds.toUpperCase();
      this.oid.gdsName = formValue.gdsName.toUpperCase().trim();
      this.oid.country = country !== null ? country.id : -1;
      this.oid.countryCode = formValue.country.toUpperCase();
      this.oid.countryName = formValue.countryName.toUpperCase().trim();
      this.oid.reasonId = this.dropDown.getReasonId(formValue.reason);
      this.oid.reason = formValue.reason.trim();
      this.oid.belongId = this.dropDown.getEntityId(formValue.belong);
      this.oid.belong = formValue.belong.trim();
      this.oid.assignId = this.dropDown.getEntityId(formValue.assign);
      this.oid.assign = formValue.assign.trim();
      this.oid.comment = formValue.comment.trim();
      this.oid.action = 'add';

      this.oidService.saveOidDto(this.oid).subscribe(value => {
        // console.log(value);
      });
      this.close();
    }
  }

  private formDefault() {
    this.form.patchValue({
      iata: '00000000', belong: 'Tickets',
      assign: 'Tickets', online: 1, status: 'reserve', reason: 'Tickets',
      country: '', countryName: '', gds: '', gdsName: ''
    });
  }

  private reasonCheck() {
    this.reasonVal = this.dropDown.reasonsIncludes(this.form.get('reason').value);
  }

  private oidEntityCheck(v: string) {
    this.oidEntityVal = this.dropDown.entityIncludes(v);
  }

  private checkGds() {
    this.gdsVal = this.dropDown.gdsInclude(this.form.controls.gds.value);
  }

  private checkCountry() {
    this.countryVal = this.dropDown.geoCountryInclude(this.form.controls.country.value);
  }

  private isGds(): boolean {

    if (this.form.controls.gds.pristine) {
      return true;
    }

    let val: boolean;
    let str: string;
    val = false;
    str = this.form.controls.gds.value;

    if (str !== null) {
      this.gdsVal.forEach(value => {
        if (value.gdsCode.toUpperCase().includes(str.toUpperCase())) {
          val = !val;
          return val;
        }
      });
    }
    return val;
  }

  private isCountry(): boolean {

    if (this.form.controls.country.pristine) {
      return true;
    }

    let val: boolean;
    let str: string;
    val = false;
    str = this.form.controls.country.value;
    if (str !== null) {
      this.countryVal.forEach(value => {
        if (value.countryCode.toUpperCase().includes(str.toUpperCase())) {
          val = !val;
          return val;
        }
      });
    }
    return val;
  }

  reset() {
    this.form.reset();
  }

  private close() {
    this.matDialogRef.close();
  }


}
