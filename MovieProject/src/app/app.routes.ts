import { Routes } from '@angular/router';
import {MovieDescription} from './components/movie-description/movie-description';
import {App} from './app';

export const routes: Routes = [

  {
    path: '',
    component: App
  },
  {
    path: 'movie/description',
    component: MovieDescription
  }
];
