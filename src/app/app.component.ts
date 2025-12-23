import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Ensure this matches your file name (.scss or .css)
})
export class AppComponent {
  
  // Inject Sanitizer to allow SVG icons to render
  private sanitizer = inject(DomSanitizer);

  // Helper method to trust SVG HTML
  getSafeIcon(svgString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }

  profile = {
    name: 'Mahmood Elbadri',
    title: 'Full Stack .NET & Angular Developer',
    bio: 'Passionate developer building robust backend systems with .NET and interactive frontends with Angular. I turn complex problems into elegant solutions.',
    linkedin: 'https://www.linkedin.com/in/mahmoodelbadri',
    github: 'https://github.com/MahmoodElbadri',
    email: 'mahmoud.elbadry357@gmail.com', 
    whatsappMe: 'whatsapp.me/+201099565685' 
  };

  skills = [
    {
      name: '.NET Core / C#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40" height="40"><path fill="#512BD4" d="M6 12c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2V14c0-1.1-.9-2-2-2H6zm0-2h36a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z"/><path fill="#fff" d="M11 31V17h2l7 10v-10h2v14h-2l-7-10v10h-2zm14 0V17h8v2h-6v4h5v2h-5v4h6v2h-8zm14 0h-2V19h-4v-2h10v2h-4v12z"/></svg>`
    },
    {
      name: 'Angular',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48"><path fill="#DD0031" d="M24 4L3 11l3 26 18 7 18-7 3-26-21-7z"/><path fill="#C3002F" d="M24 4v36l15-6 3-26-18-4z"/><path fill="#FFF" d="M24 10l-9 21h3.3l1.9-4.6h8.4l1.9 4.6h3.3L24 10zm2.7 12h-5.4L24 15l2.7 7z"/></svg>`
    },
    {
      name: 'SQL Server / PostgreSQL',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#336791" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.41 0 8 .9 8 2s-3.59 2-8 2-8-.9-8-2 3.59-2 8-2zm0 16c-4.41 0-8-.9-8-2v-2.09C5.11 14.63 8.25 15 12 15s6.89-.37 8-1.09V18c0 1.1-3.59 2-8 2zm0-4c-4.41 0-8-.9-8-2V9.91C5.11 9.37 8.25 9 12 9s6.89.37 8 .91V14c0 1.1-3.59 2-8 2z"/></svg>`
    },
    {
      name: 'Entity Framework',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#68217A" viewBox="0 0 48 48"><path d="M24 3L4 12v24l20 9 20-9V12L24 3zm0 2.7l16 7.2v20.2l-16 7.2-16-7.2V12.9l16-7.2zM17 19h14v2H17v-2zm0 5h10v2H17v-2zm0 5h14v2H17v-2z"/></svg>`
    },
    {
      name: 'Web API',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#4285F4" viewBox="0 0 48 48"><path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm0 4c8.837 0 16 7.163 16 16a15.9 15.9 0 0 1-2.123 8H10.123A15.9 15.9 0 0 1 8 24c0-8.837 7.163-16 16-16z"/><circle cx="24" cy="24" r="4" fill="#34A853"/></svg>`
    },
    {
      name: 'HTML/CSS/Bootstrap',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48"><path fill="#E44D26" d="M6 3l3.6 40.8L24 45l14.4-1.2L42 3H6z"/><path fill="#F16529" d="M24 42.1l11.6-1L36.7 6H24v36.1z"/><path fill="#EBEBEB" d="M24 20.9h-6l-.4-4.6H24V12H14l1.2 13.7H24v-4.8z"/><path fill="#FFF" d="M24 20.9v4.8h6.2l-.6 6.5L24 33v5.1l10.3-1L35.9 21H24z"/></svg>`
    }
  ];

  projects = [
    {
      title: 'Film Dashboard frontend application with Angular 18',
      description: 'A full-stack movie management system with .NET 8 Web API and Angular 18. Features include JWT Auth, Role-based access, and real-time data visualization.',
      techStack: ['.NET 8', 'Angular', 'SQL Server', 'JWT', 'CSS', 'Bootstrap', 'Type Script'],
      liveUrl: 'https://film-app.vercel.app',
      repoUrl: 'https://github.com/MahmoodElbadri/Film.Frontend',
      image: 'assets/film-project.png' // FIXED: Path should be relative to src/assets
    },
    {
      title: 'Film Dashboard backend application with .NET 9',
      description: 'An Api to manage movies with .NET 9 Web API and SQL Server. Features include JWT Auth, Role-based access, and real-time data visualization.',
      techStack: ['.NET', 'MVC', 'SQL Server', 'JWT', 'Bootstrap'],
      liveUrl: '#',
      repoUrl: 'https://github.com/MahmoodElbadri/Film',
      image: 'assets/film-backend.png'
    }
  ];

  currentYear = new Date().getFullYear();
}