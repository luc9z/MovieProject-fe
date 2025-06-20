import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FavoritosService, Filme } from '../../services/favoritos';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favoritos.html',
  styleUrls: ['./favoritos.css']
})
export class FavoritosComponent implements OnInit {
  filmes: Filme[] = [];
  usuario: string | null = null;

  constructor(
    private favoritosService: FavoritosService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuarioLogado();
    if (!this.usuario) {
      this.router.navigate(['/auth']);
      return;
    }
    this.carregarFavoritos();
  }

  carregarFavoritos() {
    this.favoritosService.getFavoritos(this.usuario!).subscribe({
      next: filmes => {
        this.filmes = [...filmes];
        this.cd.detectChanges();
      },
      error: () => {
        this.filmes = [];
        this.cd.detectChanges();
      }
    });
  }

  desfavoritar(filme: Filme, index: number) {
    if (!this.usuario) return;
    this.favoritosService.desmarcarFavorito(this.usuario, filme.id).subscribe({
      next: () => {
        this.filmes.splice(index, 1);
        this.filmes = [...this.filmes]; // força detecção
        this.cd.detectChanges();
      }
    });
  }
}
