import { 
  ChangeDetectionStrategy, 
  Component
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectLink {
  label: string;
  url: string;
  icon: string;
  disabled?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string; 
  category: string;
  description: string;
  image: string;
  icon: string;
  tags: string[];
  links: ProjectLink[];
}

@Component({
  selector: 'app-projects-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-carousel.component.html',
  styleUrl: './projects-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsCarouselComponent {
  
  projects: ProjectItem[] = [
    {
      id: '01',
      title: 'Clinic.Api (Doctor Booking)',
      category: 'Backend API',
      description: 'A robust, scalable RESTful API built with .NET Core. Features include secure JWT auth, role-based access control, appointment management, and real-time notifications via SignalR.',
      image: 'assets/api.webp',
      icon: 'bi-heart-pulse',
      tags: ['.NET Core', 'EF Core', 'SignalR', 'JWT'],
      links: [
        { label: 'GitHub', url: 'https://github.com/MahmoodElbadri/Clinic.Api', icon: 'bi-github' }
      ]
    },
    {
      id: '02',
      title: 'CareSync Frontend',
      category: 'Web App',
      description: 'A modern, responsive SPA built with Angular. Serves as the interactive dashboard for doctors to manage schedules and receive real-time WebSockets updates.',
      image: 'assets/clicnic-front.webp',
      icon: 'bi-laptop',
      tags: ['Angular', 'TypeScript', 'SCSS', 'RxJS'],
      links: [
        { label: 'GitHub', url: 'https://github.com/MahmoodElbadri/CareSync-Frontend', icon: 'bi-github' }
      ]
    },
    {
      id: '03',
      title: 'Expense Tracker API',
      category: 'Backend API',
      description: 'A secure RESTful API built with .NET 8 following Clean Architecture. Manages finances, tracks expenses, and automates recurring bills using Hangfire background jobs.',
      image: 'assets/api.webp',
      icon: 'bi-wallet2',
      tags: ['.NET 8', 'Clean Arch', 'Hangfire', 'Identity'],
      links: [
        { label: 'GitHub', url: 'https://github.com/MahmoodElbadri/ExpensesTracker', icon: 'bi-github' }
      ]
    },
    {
      id: '04',
      title: 'Expense Tracker Client',
      category: 'Web App',
      description: 'A fast, reactive SPA built with Angular 17/18 using Signals for state management. Features an interactive financial dashboard, smart interceptors, and a Glassmorphism UI.',
      image: 'assets/EX-TR.webp',
      icon: 'bi-graph-up-arrow',
      tags: ['Angular 18', 'Signals', 'Glass'],
      links: [
        { label: 'GitHub', url: 'https://github.com/MahmoodElbadri/ExpensesTracker-Client/tree/master', icon: 'bi-github' }
      ]
    },
    {
      id: '05',
      title: 'CineTrack Analytics',
      category: 'Web App',
      description: 'A dynamic movie tracking app consuming the TMDB API. Provides rich analytics on viewing habits, personalized watchlists, and a comprehensive search engine. since the camera was invented 😎😎😎',
      image: 'assets/cine-tr.webp',
      icon: 'bi-film',
      tags: ['Angular', 'TMDB API', 'Analytics', 'RxJS'],
      links: [
        { label: 'GitHub', url: 'https://github.com/MahmoodElbadri/Cinema-Tracking', icon: 'bi-github' }
      ]
    },
    {
      id: '06',
      title: 'Premium POS System',
      category: 'Enterprise',
      description: 'A commercial-grade Point of Sale (POS) system built for a private client. Features advanced inventory management, real-time sales tracking, and a responsive touch interface.',
      image: 'assets/pos.webp',
      icon: 'bi-shop',
      tags: ['Angular', '.NET', 'Enterprise', 'POS'],
      links: [
        { label: 'Private', url: '', icon: 'bi-lock-fill', disabled: true }
      ]
    }
  ];

  trackByProjectId(index: number, project: ProjectItem): string {
    return project.id;
  }
}