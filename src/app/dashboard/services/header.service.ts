import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private _onReset = new BehaviorSubject<boolean>(false);
  onReset$ = this._onReset.asObservable()
  get onReset(){
    return this._onReset.getValue()
  }
  set onReset(val: boolean){
    this._onReset.next(val)
  }
}
