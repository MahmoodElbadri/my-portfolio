import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./_components/hero/heroRoutes').then(m => m.heroRoutes) 
  },
   { 
    path: 'projects', 
    loadChildren: () => import('./_components/projects-carousel/projectsCarouselRoutes').then(m => m.projectsCarouselRoutes) 
  },
   { 
    path: 'skills', 
    loadChildren: () => import('./_components/skills/skillsRoutes').then(m => m.skillsRoutes) 
  },
   { 
    path: 'contact', 
    loadChildren: () => import('./_components/contacts/contacts.routes').then(m => m.contactsRoutes) 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
