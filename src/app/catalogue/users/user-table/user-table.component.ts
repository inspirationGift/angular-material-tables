import {Component, OnInit} from '@angular/core';
import {MyUserService} from '../../../service/my-user.service';
import {MyUser} from '../../../entities/MyUser';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {

  myUser$: Observable<MyUser[]>;

  constructor(private userService: MyUserService) {
  }

  ngOnInit() {
    this.myUser$ = this.userService.getAllMyUsers();
  }


}
