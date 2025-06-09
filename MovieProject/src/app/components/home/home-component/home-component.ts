import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header';
import {BodyComponent} from '../body/body';
import {FooterComponent} from '../footer/footer';

@Component({
  selector: 'app-home-component',
  imports: [HeaderComponent,BodyComponent,FooterComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {

}
