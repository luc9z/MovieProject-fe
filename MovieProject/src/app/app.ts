import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BodyComponent} from './components/home/body/body';
import {HeaderComponent} from './components/home/header/header';
import {FooterComponent} from './components/home/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent,FooterComponent,BodyComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'MovieProject';
}
