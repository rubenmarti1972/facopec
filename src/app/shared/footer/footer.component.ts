import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'] // si aplica
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
