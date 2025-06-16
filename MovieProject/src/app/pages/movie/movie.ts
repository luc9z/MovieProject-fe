import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService, Movie } from '../../services/movie';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie',
  standalone: true,
  templateUrl: './movie.html',
  imports: [CommonModule],
  styleUrls: ['./movie.css']
})
export class MovieComponent {
  filme$: Observable<Movie>;

  constructor(route: ActivatedRoute, movieService: MovieService) {
    const id = Number(route.snapshot.paramMap.get('id'));
    this.filme$ = movieService.getFilmeById(id);
  }
}
