import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id: number;
  titulo: string;
  genero: string;
  anoLancamento: number;
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
  private apiFilmes     = 'http://localhost:8080/filmes';
  private apiAvaliacoes = 'http://localhost:8080/avaliacoes';
  private apiFavoritos  = 'http://localhost:8080/favoritos';

  constructor(private http: HttpClient) {}

  getFilmes(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiFilmes);
  }

  buscarFilmes(titulo: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiFilmes}/buscar/${titulo}`);
  }

  filtrarPorGenero(genero: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiFilmes}/genero/${genero}`);
  }

  getFilmeById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiFilmes}/${id}`);
  }

  getAvaliacoes(idFilme: number): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(`${this.apiAvaliacoes}/${idFilme}`);
  }

  adicionarAvaliacao(idFilme: number, avaliacao: Omit<Avaliacao, 'id'>): Observable<Avaliacao> {
    return this.http.post<Avaliacao>(`${this.apiAvaliacoes}/${idFilme}`, avaliacao);
  }

  getFavoritos(usuario: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiFavoritos}/${usuario}`);
  }

  favoritarFilme(usuario: string, filmeId: number): Observable<any> {
    return this.http.post(`${this.apiFavoritos}/${usuario}/${filmeId}`, {});
  }

  desfavoritarFilme(usuario: string, filmeId: number): Observable<any> {
    return this.http.delete(`${this.apiFavoritos}/${usuario}/${filmeId}`);
  }
}
