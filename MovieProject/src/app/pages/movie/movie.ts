import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService, Movie } from '../../services/movie';
import { FavoritosService } from '../../services/favoritos';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-movie',
  standalone: true,
  templateUrl: './movie.html',
  imports: [CommonModule],
  styleUrls: ['./movie.css']
})
export class MovieComponent {
  filme$: Observable<Movie> = of();
  filmeId: number | null = null;
  favoritado = false;
  usuario: string | null = null;
  carregandoFavorito = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private favoritosService: FavoritosService,
    private authService: AuthService
  ) {
    const param = this.route.snapshot.paramMap.get('id');
    this.filmeId = param ? Number(param) : null;
    this.usuario = this.authService.getUsuarioLogado();

    if (this.filmeId) {
      this.filme$ = this.movieService.getFilmeById(this.filmeId);
      this.verificarFavorito();
    }
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
    if (!this.usuario || !this.filmeId) return;
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
          alert('Falha ao remover dos favoritos!');
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
          alert('Falha ao favoritar!');
        }
      });
    }
  }
}
