import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _loggedIn$ = new BehaviorSubject<boolean>(false);

  get loggedIn$() {
    return this._loggedIn$.asObservable();
  }

  isLoggedIn(): boolean {
    if (isBrowser()) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  checkLoginState() {
    if (isBrowser()) {
      this._loggedIn$.next(!!localStorage.getItem('token'));
    }
  }

  login(token: string) {
    if (isBrowser()) {
      localStorage.setItem('token', token);
      this._loggedIn$.next(true);
    }
  }

  logout() {
    if (isBrowser()) {
      localStorage.removeItem('token');
      this._loggedIn$.next(false);
    }
  }

  getUsuarioLogado(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userString = localStorage.getItem('usuario');
      if (userString) {
        try {
          const usuario = JSON.parse(userString);
          return usuario.email;
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}
