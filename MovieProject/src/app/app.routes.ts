import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page';
import { Home } from './pages/home/home';
import { Movie } from './pages/movie/movie';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      { path: '', component: Home },
      { path: 'movie/:id', component: Movie },
    ]
  }
];
