import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  _isLoading = new BehaviorSubject<boolean>(false);   

  isLoading$ = this._isLoading.asObservable();   


  showLoader() {
    this._isLoading.next(true);
  }

  hideLoader() {
    this._isLoading.next(false);
  }

}
