import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page';
import { HomeComponent } from './pages/home/home';
import { MovieComponent } from './pages/movie/movie';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'filmes/:id',
        component: MovieComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
