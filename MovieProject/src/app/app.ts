import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BodyComponent} from './components/home/body/body';
import {HeaderComponent} from './components/home/header/header';
import {FooterComponent} from './components/home/footer/footer';
import {MovieDescription} from './components/movie-description/movie-description';
import {HomeComponent} from './components/home/home-component/home-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HomeComponent,MovieDescription],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'MovieProject';
}
