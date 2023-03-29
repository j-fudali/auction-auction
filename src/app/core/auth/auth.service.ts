import { Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private cookies: CookieService = inject(CookieService)
  private router: Router = inject(Router)
  private userIdSubject = new BehaviorSubject<number>(0);
  userId$: Observable<number> = this.userIdSubject.asObservable()
  setUserId(id: number){
    this.userIdSubject.next(id);
  }
  getUserId(): number | null {
    return this.userIdSubject.getValue() || null;
  }
  isAuthenticated() {
    return this.cookies.get('token') ? true : false;
  }
  logout(){
    this.cookies.delete('token', '/')
    this.cookies.delete('refresh_token', '/')
    this.router.navigate(['/home'])
  }
  setToken(token: string){
    const date = DateTime.now().plus({minutes: 30})
    this.cookies.delete('token', '/')
    this.cookies.set('token', token, date.toJSDate(), '/')
  }
  setRefreshToken(refreshToken: string){
    const date = DateTime.now().plus({hours: 1, minutes: 30})
    this.cookies.delete('refresh_token', '/')
    this.cookies.set('refresh_token', refreshToken, date.toJSDate(), '/')
  }

  getToken(){
    return this.cookies.get('token');
  }
  getRefreshToken(){
    return this.cookies.get('refresh_token');
  }
}
