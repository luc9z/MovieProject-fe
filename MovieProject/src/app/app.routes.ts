import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page';
import { HomeComponent } from './pages/home/home';
import { MovieComponent } from './pages/movie/movie';
import { FavoritosComponent } from './pages/favoritos/favoritos';
import {LoginRegisterComponent} from './pages/login-register/login-register';


export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      { path: '', component: HomeComponent },
      { path: 'filmes/:id', component: MovieComponent },
      { path: 'favoritos', component: FavoritosComponent },
      { path: 'auth', component: LoginRegisterComponent }

    ]
  }
];
