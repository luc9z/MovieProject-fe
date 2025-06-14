import { Component } from '@angular/core';
import { FormsModule }            from '@angular/forms';
import { RouterModule }           from '@angular/router';
import { MatToolbarModule }       from '@angular/material/toolbar';
import { MatIconModule }          from '@angular/material/icon';
import { MatButtonModule }        from '@angular/material/button';
import { MatFormFieldModule }     from '@angular/material/form-field';
import { MatInputModule }         from '@angular/material/input';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {
  query = '';
  search(query: string) {/*...*/}
}
