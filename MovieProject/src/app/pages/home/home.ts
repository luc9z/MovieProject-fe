import { Component, OnInit } from '@angular/core';
import { MovieService, Movie } from '../../services/movie';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  filmes: Movie[] = [];
  currentPage = 1;
  itemsPerPage = 16;
  searchTerm: string = '';

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.buscarFilmes();
  }

  buscarFilmes() {
    if (this.searchTerm.trim()) {
      this.movieService.buscarFilmes(this.searchTerm).subscribe(filmes => {
        this.filmes = filmes;
        this.currentPage = 1;
      });
    } else {
      this.movieService.getFilmes().subscribe(filmes => {
        this.filmes = filmes;
        this.currentPage = 1;
      });
    }
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.buscarFilmes();
  }

  get paginatedFilmes(): Movie[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filmes.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.filmes.length > this.currentPage * this.itemsPerPage) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  navigateToMovie(id: number) {
    this.router.navigate(['/filmes', id]);
  }
}
