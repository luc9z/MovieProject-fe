import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService, Movie } from '../../services/movie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Subject, combineLatest, Observable, startWith, debounceTime, map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('movieCarousel', { static: true }) carouselEl!: ElementRef;
  fullFilmes: Movie[] = [];
  filmesData: Movie[] = [];
  filmes$: Observable<Movie[]>;
  searchTerm$ = new Subject<string>();
  generoTerm$ = new Subject<string>();
  searchTerm = '';
  selectedGenero = '';
  currentPage = 1;
  itemsPerPage = 16;
  generos = ['Ação','Comédia','Drama','Fantasia','Terror','Ficção','Romance','Aventura','Animação'];

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
      map(([search, genero]) => {
        let lista = this.fullFilmes;
        if (search) {
          lista = lista.filter(f =>
            f.titulo.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (genero) {
          lista = lista.filter(f =>
            f.genero.split(',').map(x => x.trim()).includes(genero)
          );
        }
        this.filmesData = lista;
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return lista.slice(start, start + this.itemsPerPage);
      })
    );
  }

  ngOnInit(): void {
    this.movieService.getFilmes().subscribe(f => {
      this.fullFilmes = f;
      this.searchTerm$.next('');
      this.generoTerm$.next('');
    });
  }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const { default: Carousel } = await import('bootstrap/js/dist/carousel');
      new Carousel(this.carouselEl.nativeElement, {
        interval: 3000,
        ride: 'carousel',
        wrap: true
      });
    }
  }

  onSearchInput(value: string) {
    this.searchTerm = value;
    this.currentPage = 1;
    this.selectedGenero = '';
    this.searchTerm$.next(value);
    this.generoTerm$.next('');
  }

  onGeneroChange(value: string) {
    this.selectedGenero = value;
    this.currentPage = 1;
    this.searchTerm = '';
    this.generoTerm$.next(value);
    this.searchTerm$.next('');
  }

  nextPage() {
    if (this.filmesData.length > this.currentPage * this.itemsPerPage) {
      this.currentPage++;
      this.searchTerm$.next(this.searchTerm);
      this.generoTerm$.next(this.selectedGenero);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchTerm$.next(this.searchTerm);
      this.generoTerm$.next(this.selectedGenero);
    }
  }

  navigateToMovie(id: number) {
    this.router.navigate(['/filmes', id]);
  }

  trackById(_: number, filme: Movie) {
    return filme.id;
  }
}
