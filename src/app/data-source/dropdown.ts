import {Injectable} from '@angular/core';
import {OidService} from '../service/oid.service';
import {CountryIntermediate, Gds, GdsCountry, OidReason} from '../entities/OidDto';
import {OidAccessService} from '../service/oid.access.service';
import {OidEntity} from '../entities/OidEntity';
import {Country} from '../entities/Country';
import {map, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class Dropdown {

  private gds = [];
  private country = [];
  private listOfGdsAndCountries: GdsCountry[] = [];

  // shared services
  oidReasons: OidReason[];
  gdsList: Gds[] = [];
  countryList: CountryIntermediate[] = [];
  onlineType = [{opt: 'offline', val: 0}, {opt: 'online', val: 1}];
  activeStatus = [] = [{opt: 'any', val: 0}, {opt: 'active', val: 1}, {opt: 'reserve', val: 2}, {opt: 'deleted', val: 3}];
  responsible: string[] = [];
  department: string[] = [];
  oidEntity: OidEntity[] = [];
  geoCountry: Country[];

  constructor(private oidService: OidService,
              private  oidAccessService: OidAccessService) {

    // GDS & Country definitions
    this.oidService.getGdsCountry().subscribe((value) => {
      this.listOfGdsAndCountries = value;
      // Default country list
      value.forEach(val => {
        if (!this.country.includes(val.countryId)) {
          this.country.push(val.countryId);
          this.countryList.push({
            id: val.countryId,
            countryCode: val.countryCode,
            countryName: val.countryName
          });
        }
        // Default gds list
        if (!this.gds.includes(val.gdsId)) {
          this.gds.push(val.gdsId);
          this.gdsList.push({
            id: val.gdsId,
            gdsCode: val.gdsCode,
            gdsName: val.gdsName
          });
        }
      });
    });

    this.gds = [];
    this.country = [];

    // Reasons
    this.oidService.getOidReasons().subscribe(value => {
      if (value) {
        this.oidReasons = (value);
      }
    });

    // OidEntity
    this.oidService.getOidEntity().subscribe(value => {
      this.oidEntity = value;
    });

    // geo county
    this.oidService.getCountries().subscribe(value => {
      this.geoCountry = value;
    });

    // responsible & department
    this.oidAccessService.getAllResponsible().subscribe(value => {
      value.forEach(value1 => {
        if (!this.responsible.includes(value1.responsible) && value1.responsible !== null) {
          this.responsible.push(value1.responsible);
        }
        if (!this.department.includes(value1.department) && value1.department !== null) {
          this.department.push(value1.department);
        }
      });
    });
  }


  countryByGds(gdsCode: string): CountryIntermediate[] {
    return this.listOfGdsAndCountries.filter(value => {
      return value.gdsCode === gdsCode.toUpperCase();
    }).map<CountryIntermediate>(value => {
      return {
        countryId: value.countryId,
        countryCode: value.countryCode,
        countryName: value.countryName
      };
    });

  }

  gdsByCountry(countryCode: string): Gds[] {

    return this.listOfGdsAndCountries.filter(value => {
      return countryCode.toUpperCase() !== null && value.countryCode === countryCode.toUpperCase();
    }).map<Gds>(value => {
      return {
        gdsId: value.gdsId,
        gdsCode: value.gdsCode,
        gdsName: value.gdsName
      };
    });
  }

  gdsInclude(str: string): Gds[] {
    if (str !== null) {
      str = str.toUpperCase();
      return this.gdsList.filter(value => {
        return value.gdsCode.toUpperCase() === str &&
          value.gdsCode.toUpperCase().includes(str) ||
          value.gdsName.toUpperCase().includes(str);
      });
    }
    return this.gdsList;
  }

  geoCountryInclude(str: string): Country[] {
    if (str !== null) {
      str = str.toUpperCase();
      return this.geoCountry.filter(value => {
        return value.countryCode.toUpperCase() === str ||
          value.countryCode.toUpperCase().includes(str) || value.countryName.toUpperCase().includes(str);
      });
    }
  }

  countryIntermediateInclude(str: string): CountryIntermediate[] {
    if (str !== null) {
      str = str.toUpperCase();
      return this.countryList.filter(value => {
        return value.countryCode.toUpperCase() === str ||
          value.countryCode.toUpperCase().includes(str) || value.countryName.toUpperCase().includes(str);
      });
    }
  }

  reasonsIncludes(str: string): OidReason[] {
    if (str !== null) {
      str.toUpperCase();
      return this.oidReasons.filter(value => {
        return value.reason.toLowerCase().includes(str);
      });
    }
  }

  entityIncludes(str: string): OidEntity[] {
    if (str !== null) {
      str.toUpperCase();
      return this.oidEntity.filter(value => {
        return value.entity.toLowerCase().includes(str);
      });
    }
  }

  getGdsByCode(str: string): Gds {
    let res: Gds;
    res = null;
    this.gdsList.forEach(value => {
      if (value.gdsCode.toUpperCase() === str.toUpperCase()) {
        res = value;
      }
    });
    return res;
  }

  getCountryByCode(str: string): Country {
    let res: Country;
    res = null;
    this.geoCountry.forEach(value => {
      if (value.countryCode.toUpperCase() === str.toUpperCase()) {
        res = value;
      }
    });
    return res;
  }

  getStatusId(str: string): number {
    let res: number;
    res = -1;
    this.activeStatus.forEach(value => {
      if (value.opt === str) {
        res = value.val;
      }
    });
    return res;
  }

  getReasonId(str: string): number {
    let res: number;
    res = -1;
    this.oidReasons.forEach(value => {
      if (value.reason.toUpperCase() === str.toUpperCase()) {
        res = value.id;
      }
    });
    return res;
  }

  getEntityId(str: string): number {
    let res: number;
    res = -1;
    this.oidEntity.forEach(value => {
      if (value.entity.toUpperCase() === str.toUpperCase()) {
        res = value.id;
      }
    });
    return res;
  }


}

