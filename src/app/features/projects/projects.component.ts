import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProjectLink {
  title: string;
  description: string;
  tag: string;
  href: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  readonly projects: ProjectLink[] = [
    {
      title: 'Apoyo escolar Profe en Casa',
      description: 'Refuerzos escolares, lectura guiada y clubes creativos para niñas, niños y adolescentes.',
      tag: 'Educación',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas'
    },
    {
      title: 'Ruta literaria “María”',
      description: 'Lectura en familia, creación de relatos y visitas pedagógicas por el territorio afro.',
      tag: 'Cultura',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa'
    },
    {
      title: 'Club Familias que acompañan',
      description: 'Escuela para familias, bienestar emocional y redes comunitarias que se cuidan entre sí.',
      tag: 'Bienestar',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias'
    },
    {
      title: 'Huerta y alimentación saludable',
      description: 'Agricultura urbana, cocina nutritiva y emprendimientos solidarios para el territorio.',
      tag: 'Territorio',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta'
    }
  ];
}
