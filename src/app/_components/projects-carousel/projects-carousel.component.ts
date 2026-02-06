import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal, afterNextRender, Injector } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-projects-carousel',
  standalone: true,
  templateUrl: './projects-carousel.component.html',
  styleUrl: './projects-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectsCarouselComponent {
  constructor(private injector: Injector) {
    afterNextRender(() => {
      // Initialize Swiper after view is rendered
      this.initSwiper();
    }, { injector: this.injector });
  }

  // Enhanced projects with gradient placeholders and icons
  projects = signal([
    {
      title: 'Travel Journal',
      description: 'A sophisticated travel tracking system implementing the CQRS pattern with MediatR. Features high-level server-side validation using FluentValidation and complex data relationships via Entity Framework Core.',
      tags: ['.NET 10', 'CQRS', 'MediatR', 'EF Core'],
      image: 'assets/projects/travel-journal.png',
      fallbackIcon: 'bi-airplane',
      gradientFrom: '#667eea',
      gradientTo: '#764ba2',
      githubUrl: 'https://github.com/MahmoodElbadri/Travel-Journal',
      liveUrl: null,
      year: '2024'
    },
    {
      title: 'Library Management System',
      description: 'A full-scale system for managing library resources and user workflows. Focused on clean database design and efficient CRUD operations to handle lending and inventory management seamlessly.',
      tags: ['C#', '.NET', 'SQL Server', 'Web API'],
      image: 'assets/projects/library-system.png',
      fallbackIcon: 'bi-book',
      gradientFrom: '#f093fb',
      gradientTo: '#f5576c',
      githubUrl: 'https://github.com/MahmoodElbadri/LibrarySystem',
      liveUrl: null,
      year: '2024'
    },
    {
      title: 'Mt3m Restaurant Platform',
      description: 'An Egyptian-styled restaurant management and food ordering application. Built with Angular 18 to provide a smooth, responsive user experience for menu browsing and order processing.',
      tags: ['Angular 18', 'Bootstrap', 'TypeScript', 'RxJS'],
      image: 'assets/projects/mt3m.png',
      fallbackIcon: 'bi-shop',
      gradientFrom: '#4facfe',
      gradientTo: '#00f2fe',
      githubUrl: 'https://github.com/MahmoodElbadri/Mt3m',
      liveUrl: null,
      year: '2024'
    },
    {
      title: 'AnyWare Technical Task',
      description: 'A targeted technical solution demonstrating agility in full-stack development. Showcases clean code principles and the ability to bridge Angular frontends with robust .NET backends under rigorous requirements.',
      tags: ['Full Stack', 'Angular', '.NET Core', 'REST API'],
      image: 'assets/projects/anyware.png',
      fallbackIcon: 'bi-code-slash',
      gradientFrom: '#fa709a',
      gradientTo: '#fee140',
      githubUrl: 'https://github.com/MahmoodElbadri/AnyWareTask',
      liveUrl: null,
      year: '2024'
    }
  ]);

  initSwiper() {
    const swiperEl = document.querySelector('swiper-container') as HTMLElement & { initialize: () => void };
    if (swiperEl && !swiperEl.classList.contains('swiper-initialized')) {
      swiperEl.initialize();
    }
  }

  // Handle image error - show gradient placeholder
  onImageError(event: Event, project: any) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.classList.add('show-fallback');
    }
  }
}