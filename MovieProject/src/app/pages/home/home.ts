import { Component } from '@angular/core';
import { MovieService, Movie } from '../../services/movie';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, combineLatest, Observable, startWith, debounceTime, switchMap, map } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  searchTerm$ = new Subject<string>();
  generoTerm$ = new Subject<string>();

  searchTerm = '';
  selectedGenero = '';
  currentPage = 1;
  itemsPerPage = 16;

  generos: string[] = [
    'Ação', 'Comédia', 'Drama', 'Fantasia', 'Terror', 'Ficção',
    'Romance', 'Aventura', 'Animação'
  ];

  filmesData: Movie[] = [];
  filmes$: Observable<Movie[]>;

  constructor(private movieService: MovieService, private router: Router) {
    this.filmes$ = combineLatest([
      this.searchTerm$.pipe(startWith('')),
      this.generoTerm$.pipe(startWith(''))
    ]).pipe(
      debounceTime(250),
      switchMap(([search, genero]) => {
        if (search && search.trim()) {
          return this.movieService.buscarFilmes(search.trim());
        } else if (genero && genero.trim()) {
          return this.movieService.filtrarPorGenero(genero.trim());
        } else {
          return this.movieService.getFilmes();
        }
      }),
      map(filmes => {
        this.filmesData = filmes;
        return this.paginate(filmes, this.currentPage, this.itemsPerPage);
      })
    );
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.currentPage = 1;
    this.selectedGenero = '';
    this.searchTerm$.next(value);
  }

  onGeneroChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedGenero = value;
    this.currentPage = 1;
    this.searchTerm = '';
    this.generoTerm$.next(value);
  }

  nextPage() {
    if (this.filmesData.length > this.currentPage * this.itemsPerPage) {
      this.currentPage++;
      this.emitCurrentTerms();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitCurrentTerms();
    }
  }

  emitCurrentTerms() {
    this.searchTerm$.next(this.searchTerm);
    this.generoTerm$.next(this.selectedGenero);
  }

  paginate(array: Movie[], page: number, itemsPerPage: number): Movie[] {
    const start = (page - 1) * itemsPerPage;
    return array.slice(start, start + itemsPerPage);
  }

  navigateToMovie(id: number) {
    this.router.navigate(['/filmes', id]);
  }

  trackById(index: number, filme: Movie) {
    return filme.id;
  }
}
