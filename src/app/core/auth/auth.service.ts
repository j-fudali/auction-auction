import { Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private cookies: CookieService = inject(CookieService)
  private router: Router = inject(Router)
  private userIdSubject = new BehaviorSubject<string>('');
  userId$: Observable<string> = this.userIdSubject.asObservable()
  setUserId(id: string){
    this.userIdSubject.next(id);
  }
  getUserId(): string | null {
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
    const date = new Date()
    date.setHours(date.getHours() + 1)
    date.setMinutes(date.getMinutes() + 5)
    this.cookies.set('token', token, date, '/')
  }
  setRefreshToken(refreshToken: string){
    const date = new Date()
    date.setHours(date.getHours() + 1)
    date.setMinutes(date.getMinutes() + 35)
    this.cookies.set('refresh_token', refreshToken, date, '/')
  }
  getToken(){
    return this.cookies.get('token');
  }
  getRefreshToken(){
    return this.cookies.get('refresh_token');
  }
}
