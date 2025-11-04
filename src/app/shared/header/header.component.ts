import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly navLinks: HeaderLink[] = [
    { label: 'Inicio', routerLink: '/', exact: true, dataStrapiUid: 'navigation.home' },
    { label: 'Proyectos', routerLink: '/projects', dataStrapiUid: 'navigation.projects' },
    { label: 'Ruta literaria', routerLink: '/literary-route', dataStrapiUid: 'navigation.literaryRoute' },
    { label: 'Periódico', routerLink: '/newspaper', dataStrapiUid: 'navigation.newspaper' },
    { label: 'Nosotros', routerLink: '/about', dataStrapiUid: 'navigation.about' }
  ];
}
