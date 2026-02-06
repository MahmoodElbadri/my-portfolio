import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';

interface Skill {
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'], // Fixed: Changed from styleUrl to styleUrls
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements OnInit, OnDestroy {
  private scroller = inject(ViewportScroller);

  // Dynamic text rotation
  roles = [
    'Full Stack Developer',
    'Quality Engineer',
    '.NET Specialist',
    'Angular Expert',
  ];
  currentRoleIndex = signal(0);
  currentRole = signal(this.roles[0]);
  private roleInterval?: number;

  // Tech stack showcase
  techStack: Skill[] = [
    { name: '.NET', icon: 'bi-microsoft', color: '#512BD4' }, // Microsoft's official symbol
    { name: 'Angular', icon: 'bi-app-indicator', color: '#DD0031' }, // Angular's official symbol
    { name: 'C#', icon: 'bi-braces', color: '#239120' }, // Hash represents # in C#
    { name: 'TypeScript', icon: 'bi-file-code', color: '#3178C6' }, // TS file type icon
    { name: 'SQL', icon: 'bi-database', color: '#CC2927' }, // Database icon for SQL
    { name: 'Azure', icon: 'bi-cloud', color: '#0089D6' }, // Cloud icon for Azure
  ];

  // Stats
  stats = [
    { value: '1+', label: 'Years Experience', icon: 'bi-briefcase' }, // Updated based on GitHub info
    { value: '4+', label: 'Projects Built', icon: 'bi-code-slash' }, // Updated based on GitHub info
    { value: '80%', label: 'Code Quality', icon: 'bi-shield-check' },
  ];

  // Mouse position for parallax effect
  mouseX = signal(0);
  mouseY = signal(0);

  ngOnInit() {
    // Start role rotation
    this.startRoleRotation();
  }

  ngOnDestroy() {
    if (this.roleInterval) {
      clearInterval(this.roleInterval);
    }
  }

  startRoleRotation() {
    this.roleInterval = window.setInterval(() => {
      const nextIndex = (this.currentRoleIndex() + 1) % this.roles.length;
      this.currentRoleIndex.set(nextIndex);
      this.currentRole.set(this.roles[nextIndex]);
    }, 3000);
  }

  scrollTo(sectionId: string) {
    this.scroller.scrollToAnchor(sectionId);
  }

  onMouseMove(event: MouseEvent) {
    const x = (event.clientX / window.innerWidth - 0.5) * 20;
    const y = (event.clientY / window.innerHeight - 0.5) * 20;
    this.mouseX.set(x);
    this.mouseY.set(y);
  }

  downloadCV() {
    // For now just open email client since no CV exists
    window.open(
      'mailto:mahmoud.elbadry357@gmail.com?subject=CV Request&body=Hi Mahmoud, I would like to see your CV.',
      '_blank',
    );
  }
}
