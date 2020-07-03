export interface OidPage {
  content: OidDto[];
  totalPages: number;
  totalElements: number;
}

export class OidDto {
  oid: string;
  iata: string;
  status: number;
  statusName: string;
  type: number;
  comment: string;
  country: number;
  countryCode: string;
  countryName: string;
  gds: number;
  gdsCode: string;
  gdsName: string;
  reasonId: number;
  reason: string;
  belongId: number;
  belong: string;
  assignId: number;
  assign: string;
  action: string;

  constructor() {
  }
}

export interface OidReason {
  id?: number;
  reason: string;
}

export interface CountryIntermediate {
  id?: number;
  countryCode: string;
  countryName: string;
}

export interface Gds {
  id?: number;
  gdsCode: string;
  gdsName: string;
}

export interface GdsCountry {
  gdsId?: number;
  gdsCode: string;
  gdsName: string;
  countryId?: number;
  countryCode: string;
  countryName: string;
}


