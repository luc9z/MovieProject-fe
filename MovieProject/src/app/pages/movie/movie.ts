import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService, Movie } from '../../services/movie';
import { FavoritosService } from '../../services/favoritos';
import { AvaliacaoService, Avaliacao } from '../../services/avaliacao';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movie',
  standalone: true,
  templateUrl: './movie.html',
  styleUrls: ['./movie.css'],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class MovieComponent implements OnInit {
  filme$: Observable<Movie> = of();
  filmeId: number | null = null;
  favoritado = false;
  usuario: string | null = null;
  usuarioNome: string = '';
  carregandoFavorito = false;
  estaLogado = false;

  avaliacoes: Avaliacao[] = [];
  avaliacaoNota = 0;
  hoverNota = 0;
  avaliacaoComentario = '';
  avaliacaoEnviando = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private favoritosService: FavoritosService,
    private avaliacaoService: AvaliacaoService,
    private authService: AuthService
  ) {
    const param = this.route.snapshot.paramMap.get('id');
    this.filmeId = param ? Number(param) : null;
    this.usuario = this.authService.getUsuarioLogado();
    this.usuarioNome = this.authService.getNomeUsuarioLogado() || '';
    this.estaLogado = !!this.usuario;

    if (this.filmeId) {
      this.filme$ = this.movieService.getFilmeById(this.filmeId);
      this.verificarFavorito();
      this.carregarAvaliacoes();
    }
  }

  ngOnInit() {
    this.estaLogado = !!this.authService.getUsuarioLogado();
  }

  verificarFavorito() {
    if (!this.usuario || !this.filmeId) return;
    this.carregandoFavorito = true;
    this.favoritosService.getFavoritos(this.usuario).subscribe({
      next: filmes => {
        this.favoritado = filmes.some(f => f.id === this.filmeId);
        this.carregandoFavorito = false;
      },
      error: () => {
        this.favoritado = false;
        this.carregandoFavorito = false;
      }
    });
  }

  toggleFavorito() {
    if (!this.estaLogado || !this.usuario || !this.filmeId) return;
    this.carregandoFavorito = true;
    const estadoAnterior = this.favoritado;
    this.favoritado = !this.favoritado;
    if (estadoAnterior) {
      this.favoritosService.desmarcarFavorito(this.usuario, this.filmeId).subscribe({
        next: () => {
          this.carregandoFavorito = false;
        },
        error: () => {
          this.favoritado = true;
          this.carregandoFavorito = false;
        }
      });
    } else {
      this.favoritosService.marcarFavorito(this.usuario, this.filmeId).subscribe({
        next: () => {
          this.carregandoFavorito = false;
        },
        error: () => {
          this.favoritado = false;
          this.carregandoFavorito = false;
        }
      });
    }
  }

  setNota(nota: number) {
    this.avaliacaoNota = nota;
  }

  enviarAvaliacao(filmeId: number) {
    if (!this.avaliacaoNota || !this.usuarioNome || !this.avaliacaoComentario) return;
    this.avaliacaoEnviando = true;
    const avaliacao: Avaliacao = {
      autor: this.usuarioNome,
      comentario: this.avaliacaoComentario,
      nota: this.avaliacaoNota
    };
    this.avaliacaoService.cadastrarAvaliacao(filmeId, avaliacao).subscribe({
      next: () => {
        this.avaliacaoComentario = '';
        this.avaliacaoNota = 0;
        this.avaliacaoEnviando = false;
        this.carregarAvaliacoes();
        this.filme$ = this.movieService.getFilmeById(filmeId);


        Swal.fire({
          icon: 'success',
          title: 'Avaliação Enviada',
          text: 'Sua avaliação foi enviada com sucesso!',
        });
      },
      error: () => {
        this.avaliacaoEnviando = false;
        this.carregarAvaliacoes();


        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Houve um erro ao enviar sua avaliação. Tente novamente!',
        });
      }
    });
  }

  carregarAvaliacoes() {
    if (!this.filmeId) return;
    this.avaliacaoService.listarAvaliacoes(this.filmeId).subscribe({
      next: avaliacoes => {
        this.avaliacoes = avaliacoes.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      },
      error: () => {
        this.avaliacoes = [];
      }
    });
  }
}
