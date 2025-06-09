import { Component } from '@angular/core';
import {FooterComponent} from '../home/footer/footer';
import {HeaderComponent} from '../home/header/header';

@Component({
  selector: 'app-movie-description',
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './movie-description.html',
  styleUrl: './movie-description.css'
})
export class MovieDescription {

}
