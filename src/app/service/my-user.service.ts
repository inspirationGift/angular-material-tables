import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MyUser} from '../entities/MyUser';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class MyUserService {

  constructor(private http: HttpClient) {
  }

  getAllMyUsers(): Observable<MyUser[]> {

    return this.http.get(`${environment.fbDbUrl}/admin/users`)
      .pipe(map((response: { [key: string]: any }) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key]
            // id: key,
            // date: new Date(response[key].date)
          }));
      }));
  }

}
