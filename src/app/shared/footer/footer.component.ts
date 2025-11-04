import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly quickLinks: FooterLink[] = [
    { label: 'Quiénes somos', routerLink: '/about', dataStrapiUid: 'footer.links.about' },
    { label: 'Programas y proyectos', routerLink: '/projects', dataStrapiUid: 'footer.links.projects' },
    { label: 'Ruta literaria María', routerLink: '/literary-route', dataStrapiUid: 'footer.links.literaryRoute' },
    { label: 'Periódico comunitario', routerLink: '/newspaper', dataStrapiUid: 'footer.links.newspaper' },
    { label: 'Donaciones', routerLink: '/donate', dataStrapiUid: 'footer.links.donate' }
  ];

  readonly resourceLinks: FooterLink[] = [
    {
      label: 'Actividades en el blog',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/',
      external: true,
      dataStrapiUid: 'footer.links.blog'
    },
    {
      label: 'Catálogo en WhatsApp',
      href: 'https://wa.me/573215230283',
      external: true,
      dataStrapiUid: 'footer.links.catalog'
    },
    {
      label: 'Ubícanos en Google Maps',
      href: 'https://www.google.com/maps/search/?api=1&query=Cra+22+%238-9,+Puerto+Tejada,+Cauca,+Colombia',
      external: true,
      dataStrapiUid: 'footer.links.maps'
    }
  ];

  readonly socialLinks: SocialLink[] = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa',
      icon: 'facebook',
      dataStrapiUid: 'footer.social.facebook'
    },
    {
      label: 'X (Twitter)',
      href: 'https://x.com/FundacionProfe',
      icon: 'x',
      dataStrapiUid: 'footer.social.x'
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/fundacion_profeencasa',
      icon: 'instagram',
      dataStrapiUid: 'footer.social.instagram'
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@fundacionprofeencasa',
      icon: 'youtube',
      dataStrapiUid: 'footer.social.youtube'
    }
  ];
}
