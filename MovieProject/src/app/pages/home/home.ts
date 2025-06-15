import { Component, OnInit } from '@angular/core';
import { MovieService, Movie } from '../../services/movie';
import { RouterModule, RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [RouterLink, RouterModule]
})
export class HomeComponent implements OnInit {
  filmes: Movie[] = [];
  currentPage = 1;
  itemsPerPage = 16;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getFilmes().subscribe((data) => {
      this.filmes = data;
      console.log('Filmes recebidos:', data);
    });
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

}
