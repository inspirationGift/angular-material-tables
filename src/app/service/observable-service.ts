import {BehaviorSubject} from 'rxjs';
import {Injectable, OnDestroy} from '@angular/core';
import {OidDto} from '../entities/OidDto';

@Injectable({
  providedIn: 'root'
})

export class ObservableService implements OnDestroy {
  private sharedValue: SharedValue;
  private inventorySubject$ = new BehaviorSubject<SharedValue>(this.sharedValue);
  inventoryChanged$ = this.inventorySubject$.asObservable();

  constructor() {
  }

  addToObservableBox(val: SharedValue): void {
    this.sharedValue = val;
    this.inventorySubject$.next(this.sharedValue);
  }

  ngOnDestroy(): void {
    this.sharedValue = null;
    // this.inventorySubject$.unsubscribe();
    // this.inventoryChanged$ = null;
  }
}

export class SharedValue {
  name: string;
  value: any;


  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}

