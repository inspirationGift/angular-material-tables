import {Component, OnInit} from '@angular/core';
import {OidService} from '../service/oid.service';
import {OidDto} from '../entities/OidDto';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {


  oids: OidDto[];

  constructor(private service: OidService) {
  }


  ngOnInit() {
    this.service.getOidDto().subscribe(data => {
      this.oids = data;
    });
  }

}
