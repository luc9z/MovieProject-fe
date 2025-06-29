// src/app/pages/home/home.component.ts
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService, Movie } from '../../services/movie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Subject,
  combineLatest,
  Observable,
  startWith,
  debounceTime,
  switchMap,
  map
} from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('movieCarousel', { static: true }) carouselEl!: ElementRef;

  searchTerm$    = new Subject<string>();
  generoTerm$    = new Subject<string>();
  searchTerm     = '';
  selectedGenero = '';
  currentPage    = 1;
  itemsPerPage   = 16;

  generos: string[] = [
    'Ação', 'Comédia', 'Drama', 'Fantasia', 'Terror',
    'Ficção', 'Romance', 'Aventura', 'Animação'
  ];
  filmesData: Movie[] = [];
  filmes$: Observable<Movie[]>;

  constructor(
    private movieService: MovieService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.filmes$ = combineLatest([
      this.searchTerm$.pipe(startWith('')),
      this.generoTerm$.pipe(startWith(''))
    ]).pipe(
      debounceTime(250),
      switchMap(([search, genero]) => {
        if (search.trim()) {
          return this.movieService.buscarFilmes(search.trim());
        } else if (genero.trim()) {
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

  ngOnInit(): void {
    this.searchTerm$.next('');
    this.generoTerm$.next('');
  }

  async ngAfterViewInit(): Promise<void> {
    // só roda no browser
    if (isPlatformBrowser(this.platformId)) {
      const { default: Carousel } = await import('bootstrap/js/dist/carousel');
      new Carousel(this.carouselEl.nativeElement, {
        interval: 3000,
        ride: 'carousel',
        wrap: true
      });
    }
  }

  onSearchInput(event: Event) {
    const v = (event.target as HTMLInputElement).value;
    this.searchTerm = v;
    this.currentPage = 1;
    this.selectedGenero = '';
    this.searchTerm$.next(v);
  }

  onGeneroChange(event: Event) {
    const v = (event.target as HTMLSelectElement).value;
    this.selectedGenero = v;
    this.currentPage = 1;
    this.searchTerm = '';
    this.generoTerm$.next(v);
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

  trackById(_: number, filme: Movie) {
    return filme.id;
  }
}
