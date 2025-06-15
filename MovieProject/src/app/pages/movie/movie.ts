import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService, Movie } from '../../services/movie';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie',
  standalone: true,
  templateUrl: './movie.html',
  styleUrls: ['./movie.css'],
  imports: [CommonModule]
})
export class MovieComponent implements OnInit {
  filme: Movie | null = null;
  erro = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    console.log('🆔 ID extraído da rota:', idParam);

    if (!isNaN(id) && id > 0) {
      this.movieService.getFilmeById(id).subscribe({
        next: (filme) => {
          this.filme = filme;
        },
        error: (err) => {
          console.error('Erro ao carregar filme:', err);
          this.erro = true;
        }
      });
    } else {
      console.warn('🚫 ID inválido:', idParam);
      this.erro = true;
    }
  }
}
