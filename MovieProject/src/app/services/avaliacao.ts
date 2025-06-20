import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Avaliacao {
  id?: number;
  autor: string;
  comentario: string;
  nota: number;
}

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  private apiUrl = 'http://localhost:8080/avaliacoes';

  constructor(private http: HttpClient) {}

  listarAvaliacoes(filmeId: number): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(`${this.apiUrl}/${filmeId}`);
  }

  cadastrarAvaliacao(filmeId: number, avaliacao: Avaliacao): Observable<Avaliacao> {
    return this.http.post<Avaliacao>(`${this.apiUrl}/${filmeId}`, avaliacao);
  }
}
