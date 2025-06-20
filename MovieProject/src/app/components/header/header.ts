import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatIcon,
    MatToolbar,
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  logado = false;
  private sub?: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.authService.loggedIn$.subscribe(loggedIn => {
      this.logado = loggedIn;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
