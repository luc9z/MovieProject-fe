import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Filme {
  id: number;
  titulo: string;
  genero: string;
  anoLancamento: number;
  imagemUrl: string;
  notaMedia: number;
  sinopse?: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private apiUrl = 'http://localhost:8080/favoritos';

  constructor(private http: HttpClient) {}

  getFavoritos(usuario: string): Observable<Filme[]> {
    return this.http.get<Filme[]>(`${this.apiUrl}/${usuario}`);
  }

  marcarFavorito(usuario: string, filmeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${usuario}/${filmeId}`, {});
  }

  desmarcarFavorito(usuario: string, filmeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${usuario}/${filmeId}`);
  }
}
