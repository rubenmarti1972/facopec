import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface HeroStat {
  label: string;
  value: string;
}

interface HeroAction {
  label: string;
  routerLink?: string;
  href?: string;
  variant: 'primary' | 'secondary';
  dataStrapiUid: string;
}

interface ActivityCard {
  title: string;
  description: string;
  href: string;
  icon: string;
  theme: 'teal' | 'blue' | 'rose' | 'gold';
  dataStrapiUid: string;
}

interface ProgramCard {
  title: string;
  description: string;
  highlights: string[];
  href: string;
  strapiCollection: string;
  strapiEntryId: string;
}

interface CatalogItem {
  title: string;
  description: string;
  price: string;
  href: string;
  strapiCollection: string;
  strapiEntryId: string;
}

interface GalleryItem {
  title: string;
  description: string;
  cover: string;
  type: 'image' | 'video';
  href: string;
  strapiCollection: string;
  strapiEntryId: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  readonly hero = {
    eyebrow: 'Misión con sentido social',
    title: ['Transformamos vidas', 'a través de la educación y el cuidado'],
    lead:
      'Somos la Fundación Afrocolombiana Profe en Casa. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Valle del Cauca.',
    stats: <HeroStat[]>[
      { value: '+180', label: 'Estudiantes acompañados con tutorías y mentorías' },
      { value: '35', label: 'Voluntarios activos en programas comunitarios' },
      { value: '12', label: 'Barrios impactados con actividades presenciales y virtuales' }
    ],
    actions: <HeroAction[]>[
      { label: 'Donar ahora', routerLink: '/donate', variant: 'primary', dataStrapiUid: 'hero.actions.donate' },
      { label: 'Ver actividades', href: '#actividades', variant: 'secondary', dataStrapiUid: 'hero.actions.activities' }
    ],
    verse: {
      reference: 'Proverbios 3:13',
      text: '“Feliz quien halla sabiduría”',
      description:
        'Creamos espacios seguros para aprender, compartir y crecer en comunidad. Creemos en el poder de la lectura, la tecnología y la fe para transformar historias.'
    }
  };

  readonly impactHighlights = [
    {
      icon: '📚',
      title: 'Educación integral',
      label: 'Tutorías, clubes de lectura y acompañamiento pedagógico',
      dataStrapiUid: 'impact.education'
    },
    {
      icon: '🤝🏾',
      title: 'Tejido comunitario',
      label: 'Trabajo con familias, líderes y aliados del territorio',
      dataStrapiUid: 'impact.community'
    },
    {
      icon: '🌱',
      title: 'Valores y fe',
      label: 'Formación espiritual, bienestar emocional y liderazgo',
      dataStrapiUid: 'impact.faith'
    }
  ];

  readonly missionVision = {
    mission:
      'Promover oportunidades educativas, culturales y espirituales que fortalezcan las familias afrocolombianas a través de procesos innovadores y acompañamiento integral desde el hogar.',
    vision:
      'Ser una red comunitaria referente en el Valle del Cauca que potencia los sueños de la niñez y juventud afrodescendiente con programas de calidad, alianzas solidarias y tecnologías inclusivas.',
    dataStrapiUidMission: 'about.mission',
    dataStrapiUidVision: 'about.vision'
  };

  readonly activityCards: ActivityCard[] = [
    {
      title: 'Tutorías Profe en Casa',
      description: 'Refuerzo escolar personalizado, acompañamiento en tareas y aprendizaje basado en proyectos.',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas',
      icon: '🧠',
      theme: 'teal',
      dataStrapiUid: 'activities.tutorias'
    },
    {
      title: 'Ruta Literaria María',
      description: 'Lectura en voz alta, círculos literarios y creación de cuentos inspirados en nuestras raíces afro.',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria',
      icon: '📖',
      theme: 'blue',
      dataStrapiUid: 'activities.rutaLiteraria'
    },
    {
      title: 'Huerta y alimentación',
      description: 'Huertas urbanas, cocina saludable y emprendimientos familiares con enfoque sostenible.',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta',
      icon: '🥬',
      theme: 'gold',
      dataStrapiUid: 'activities.huerta'
    },
    {
      title: 'Arte, danza y fe',
      description: 'Laboratorios creativos, espacios de oración y actividades culturales para toda la comunidad.',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Cultura',
      icon: '🎨',
      theme: 'rose',
      dataStrapiUid: 'activities.arte'
    }
  ];

  readonly programCards: ProgramCard[] = [
    {
      title: 'Semillero Digital',
      description:
        'Talleres STEAM, alfabetización digital y mentorías vocacionales que conectan a jóvenes con oportunidades tecnológicas.',
      highlights: ['Tecnología', 'Innovación', 'Mentorías'],
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Semillero%20Digital',
      strapiCollection: 'programas',
      strapiEntryId: 'semillero-digital'
    },
    {
      title: 'Club Familias que Acompañan',
      description:
        'Escuela de padres, orientación psicoemocional y redes solidarias para fortalecer el cuidado en casa.',
      highlights: ['Familias', 'Bienestar', 'Prevención'],
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias',
      strapiCollection: 'programas',
      strapiEntryId: 'club-familias'
    }
  ];

  readonly catalogItems: CatalogItem[] = [
    {
      title: 'Kit escolar completo',
      description: 'Útiles, lecturas y materiales artísticos para un estudiante durante un trimestre.',
      price: '$85.000 COP',
      href: 'https://wa.me/p/5881121183974635/573215230283',
      strapiCollection: 'catalogo-whatsapp',
      strapiEntryId: 'kit-escolar'
    },
    {
      title: 'Canasta solidaria',
      description: 'Apoyo nutricional para familias con niñas y niños en refuerzo escolar durante un mes.',
      price: '$70.000 COP',
      href: 'https://wa.me/p/5979113203538798/573215230283',
      strapiCollection: 'catalogo-whatsapp',
      strapiEntryId: 'canasta-solidaria'
    },
    {
      title: 'Apadrina una tutoría',
      description: 'Financia sesiones personalizadas y acompañamiento pedagógico para un estudiante.',
      price: '$45.000 COP',
      href: 'https://wa.me/p/5332119887812567/573215230283',
      strapiCollection: 'catalogo-whatsapp',
      strapiEntryId: 'apadrina-tutoria'
    }
  ];

  readonly galleryItems: GalleryItem[] = [
    {
      title: 'Laboratorio de lectura',
      description: 'Niños y niñas viven experiencias literarias en la biblioteca comunitaria.',
      cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
      type: 'image',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/2023/09/lectura-en-comunidad.html',
      strapiCollection: 'galeria',
      strapiEntryId: 'laboratorio-lectura'
    },
    {
      title: 'Huerta escolar comunitaria',
      description: 'Familias cosechan alimentos y aprenden sobre soberanía alimentaria.',
      cover: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1000&q=80',
      type: 'image',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/2023/06/huerta-escolar.html',
      strapiCollection: 'galeria',
      strapiEntryId: 'huerta-escolar'
    },
    {
      title: 'Testimonio en video',
      description: 'Conoce cómo la fundación impacta a las familias del Cauca.',
      cover: 'https://img.youtube.com/vi/VN0qfM2Yg2w/hqdefault.jpg',
      type: 'video',
      href: 'https://www.youtube.com/watch?v=VN0qfM2Yg2w',
      strapiCollection: 'galeria',
      strapiEntryId: 'testimonio-video'
    }
  ];
}
