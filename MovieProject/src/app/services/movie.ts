import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id: number;
  titulo: string;
  genero: string;
  ano: number;
  sinopse: string;
  notaMedia: number;
  imagemUrl: string;
}

export interface Avaliacao {
  id: number;
  autor: string;
  comentario: string;
  nota: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/filmes';

  constructor(private http: HttpClient) {}

  getFilmes(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  buscarFilmes(titulo: string): Observable<Movie[]> {
    const params = new HttpParams().set('titulo', titulo);
    return this.http.get<Movie[]>(`${this.apiUrl}/buscar`, { params });
  }

  filtrarPorGenero(genero: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/genero/${genero}`);
  }

  getFilmeById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  getAvaliacoes(idFilme: number): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(`${this.apiUrl}/${idFilme}/avaliacoes`);
  }

  adicionarAvaliacao(idFilme: number, avaliacao: Omit<Avaliacao, 'id'>): Observable<Avaliacao> {
    return this.http.post<Avaliacao>(`${this.apiUrl}/${idFilme}/avaliacoes`, avaliacao);
  }

  favoritarFilme(idFilme: number, idUsuario: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idFilme}/favoritos`, { usuarioId: idUsuario });
  }

  desfavoritarFilme(idFilme: number, idUsuario: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idFilme}/favoritos/${idUsuario}`);
  }

  getFavoritos(idUsuario: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/favoritos/${idUsuario}`);
  }
}
