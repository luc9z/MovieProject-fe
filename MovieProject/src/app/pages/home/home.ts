import { Component, OnInit, OnDestroy } from '@angular/core';
import { MovieService, Movie } from '../../services/movie';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, Observable, Subscription, debounceTime, switchMap, startWith, map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  filmes$: Observable<Movie[]>;
  private searchTerm$ = new Subject<string>();
  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 16;

  private filmesData: Movie[] = [];
  private sub?: Subscription;

  constructor(private movieService: MovieService, private router: Router) {
    this.filmes$ = this.searchTerm$.pipe(
      startWith(''),
      debounceTime(250),
      switchMap((term) =>
        term.trim()
          ? this.movieService.buscarFilmes(term.trim())
          : this.movieService.getFilmes()
      ),
      map(filmes => {
        this.filmesData = filmes;
        return this.paginate(filmes, this.currentPage, this.itemsPerPage);
      })
    );
  }

  ngOnInit(): void {
    this.searchTerm$.next('');
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.currentPage = 1;
    this.searchTerm$.next(value);
  }

  nextPage() {
    if (this.filmesData.length > this.currentPage * this.itemsPerPage) {
      this.currentPage++;
      this.refreshPage();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.refreshPage();
    }
  }

  refreshPage() {
    this.filmes$ = this.searchTerm$.pipe(
      startWith(this.searchTerm),
      switchMap((term) =>
        term.trim()
          ? this.movieService.buscarFilmes(term.trim())
          : this.movieService.getFilmes()
      ),
      map(filmes => {
        this.filmesData = filmes;
        return this.paginate(filmes, this.currentPage, this.itemsPerPage);
      })
    );
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
