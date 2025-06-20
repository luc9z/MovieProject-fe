import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './user';

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

  login(token: string, usuario: Usuario) {
    if (isBrowser()) {
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      this._loggedIn$.next(true);
    }
  }

  logout() {
    if (isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      this._loggedIn$.next(false);
    }
  }

  getUsuarioLogado(): string | null {
    if (isBrowser()) {
      const usuario = localStorage.getItem('usuario');
      if (!usuario) return null;
      try {
        return JSON.parse(usuario).email || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  getNomeUsuarioLogado(): string | null {
    if (isBrowser()) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        try {
          const user = JSON.parse(usuario);
          return user.nome || user.email || null;
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}
