import {Component, OnInit} from '@angular/core';
import {Gds, OidDto, OidReason} from '../../../../../entities/OidDto';
import {ObservableService} from '../../../../../service/observable-service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Dropdown} from '../../../../../data-source/dropdown';
import {OidService} from '../../../../../service/oid.service';
import {OidEntity} from '../../../../../entities/OidEntity';
import {Country} from '../../../../../entities/Country';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-oid-pop-ua',
  templateUrl: './edit-oid-pop-ua.component.html',
  styleUrls: ['./edit-oid-pop-ua.component.scss']
})
export class EditOidPopUaComponent implements OnInit {

  private oid: OidDto;
  private form: FormGroup;
  private showDelete = false;
  private oidEntityVal: OidEntity[];
  private status = [];
  private reasonVal: OidReason[];
  private initStatus: { val: number, opt: string };
  private deleteStatus: { val: number, opt: string };
  private alert: string;
  private alertToggle: boolean;
  private noticeClass: string;


  constructor(private observableService: ObservableService,
              private dropdown: Dropdown,
              private oidService: OidService,
              private matDialogRef: MatDialogRef<EditOidPopUaComponent>) {
  }

  ngOnInit(): void {
    this.alertToggle = true;
    this.reasonVal = this.dropdown.oidReasons;
    this.oidEntityVal = this.dropdown.oidEntity;
    this.alert = null;
    this.status = this.dropdown.activeStatus.filter(value => {
      if (value.opt === 'deleted') {
        this.deleteStatus = {opt: value.opt, val: value.val};
      }
      if (value.opt !== 'any') {
        return value;
      }
    });

    this.observableService.inventoryChanged$.subscribe(value => {
      if (value && value.name === 'FromOidToEdit') {
        this.oid = value.value;
        this.initStatus = {opt: this.oid.statusName, val: this.oid.status};
      }
    });

    this.form = new FormGroup({
      gds: new FormControl({value: this.oid.gdsCode, disabled: true}, Validators.required),
      country: new FormControl({value: this.oid.countryCode, disabled: true}, Validators.required),
      pcc: new FormControl({value: this.oid.oid, disabled: true}, Validators.required),
      iata: new FormControl(this.oid.iata, [
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(5),
        Validators.pattern('[a-zA-Z0-9]*')
      ]),
      online: new FormControl(this.oid.type, [
        Validators.required
      ]),
      status: new FormControl(this.oid.statusName, [
        Validators.required
      ]),
      belong: new FormControl(this.oid.belong, [
        Validators.required,
        Validators.pattern('[a-zA-Z -.]*')
      ]),
      assign: new FormControl(this.oid.assign, [
        Validators.required,
        Validators.pattern('[a-zA-Z -.]*')
      ]),
      reason: new FormControl(this.oid.reason, [
        Validators.required,
        Validators.pattern('[a-zA-Z. -]*')
      ]),
      comment: new FormControl(this.oid.comment),
      countryName: new FormControl(),
      gdsName: new FormControl()
    });
  }

  deleteAction() {
    this.alertToggle = !this.alertToggle;
    this.alert = 'Attention! PCC ' + this.oid.oid.toString().toUpperCase() + ' will be deleted!';
    this.noticeClass = 'alert alert-danger';
    this.showDelete = true;
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
    gds = this.dropdown.getGdsByCode(formValue.gds);
    country = this.dropdown.getCountryByCode(formValue.country);

    if (country !== null) {
      this.form.patchValue({countryName: country.countryName});
    }

    if (gds !== null) {
      this.form.patchValue({gdsName: gds.gdsName});
    }

    if (!this.form.invalid) {

      formValue = this.form.getRawValue();
      this.oid.oid = formValue.pcc.toUpperCase();
      this.oid.iata = formValue.iata.toUpperCase();
      this.oid.type = formValue.online;
      this.oid.status = this.dropdown.getStatusId(formValue.status);
      this.oid.statusName = formValue.status;
      this.oid.gds = gds !== null ? gds.id : -1;
      this.oid.gdsCode = formValue.gds.toUpperCase();
      this.oid.gdsName = formValue.gdsName.toUpperCase().trim().trim();
      this.oid.country = country !== null ? country.id : -1;
      this.oid.countryCode = formValue.country.toUpperCase();
      this.oid.countryName = formValue.countryName.toUpperCase().trim();
      this.oid.reasonId = this.dropdown.getReasonId(formValue.reason);
      this.oid.reason = formValue.reason.trim();
      this.oid.belongId = this.dropdown.getEntityId(formValue.belong);
      this.oid.belong = formValue.belong.trim();
      this.oid.assignId = this.dropdown.getEntityId(formValue.assign);
      this.oid.assign = formValue.assign.trim();
      this.oid.comment = formValue.comment;
      this.oid.action = 'update';

      this.oidService.saveOidDto(this.oid).subscribe(value => {
        if (value) {
          this.close();
        }
      });

    }


  }

  private deleteOid() {

    this.showDelete = false;
    if (this.oid.statusName !== 'deleted') {
      this.oid.statusName = this.deleteStatus.opt;
      this.oid.status = this.deleteStatus.val;
      this.oidService.deleteOid(this.oid).subscribe(data => {
        if (data) {
          this.alertToggle = false;
          this.alert = 'deleted';
          this.noticeClass = 'alert alert-success';

          this.form.controls.status.setValue('deleted');
          setTimeout(() => {
            this.close();
          }, 3000);
        } else {
          this.oid.statusName = this.initStatus.opt;
          this.oid.status = this.initStatus.val;
          this.alertToggle = false;
          this.alert = 'Failed!';
          this.noticeClass = 'alert alert-danger';
          setTimeout(() => {
            this.alertToggle = !this.alertToggle;
          }, 2000);
        }
      });

    }

  }

  private reasonCheck() {
    this.reasonVal = this.dropdown.reasonsIncludes(this.form.get('reason').value);
  }

  private oidEntityCheck(v: string) {
    this.oidEntityVal = this.dropdown.entityIncludes(v);
  }

  private close() {
    this.matDialogRef.close();
  }
}

