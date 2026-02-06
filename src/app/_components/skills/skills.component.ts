import { Component, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  level: number;
  category: string;
  icon: string;
  color: string;
}

interface SkillCategory {
  title: string;
  icon: string;
  gradient: string;
  skills: Skill[];
  description: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsComponent implements OnInit {
  
  // Skill categories with detailed information
  skillCategories: SkillCategory[] = [
    {
      title: 'Backend Development',
      icon: 'bi-server',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Building robust, scalable server-side applications',
      skills: [
        { name: '.NET 10', level: 95, category: 'backend', icon: 'bi-code-square', color: '#512BD4' },
        { name: 'ASP.NET Core', level: 90, category: 'backend', icon: 'bi-layers', color: '#512BD4' },
        { name: 'C#', level: 92, category: 'backend', icon: 'bi-braces', color: '#239120' },
        { name: 'Entity Framework', level: 88, category: 'backend', icon: 'bi-database-gear', color: '#512BD4' },
        { name: 'Web API', level: 90, category: 'backend', icon: 'bi-arrow-left-right', color: '#0089D6' }
      ]
    },
    {
      title: 'Frontend Development',
      icon: 'bi-palette',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'Crafting beautiful, responsive user interfaces',
      skills: [
        { name: 'Angular 18', level: 90, category: 'frontend', icon: 'bi-app-indicator', color: '#DD0031' },
        { name: 'TypeScript', level: 88, category: 'frontend', icon: 'bi-file-code', color: '#3178C6' },
        { name: 'RxJS', level: 85, category: 'frontend', icon: 'bi-arrow-repeat', color: '#B7178C' },
        { name: 'HTML/CSS', level: 92, category: 'frontend', icon: 'bi-filetype-html', color: '#E34F26' },
        { name: 'Bootstrap', level: 87, category: 'frontend', icon: 'bi-bootstrap', color: '#7952B3' }
      ]
    },
    {
      title: 'Database & Architecture',
      icon: 'bi-database',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'Designing efficient data structures and patterns',
      skills: [
        { name: 'SQL Server', level: 88, category: 'database', icon: 'bi-database', color: '#CC2927' },
        { name: 'CQRS Pattern', level: 85, category: 'architecture', icon: 'bi-diagram-3', color: '#3B82F6' },
        { name: 'MediatR', level: 82, category: 'architecture', icon: 'bi-bezier', color: '#8B5CF6' },
        { name: 'Clean Code', level: 90, category: 'architecture', icon: 'bi-code-slash', color: '#10B981' },
        { name: 'REST API', level: 89, category: 'architecture', icon: 'bi-plug', color: '#F59E0B' }
      ]
    },
    {
      title: 'Quality Assurance',
      icon: 'bi-shield-check',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      description: 'Ensuring code quality and reliability',
      skills: [
        { name: 'Unit Testing', level: 88, category: 'qa', icon: 'bi-check2-circle', color: '#10B981' },
        { name: 'FluentValidation', level: 85, category: 'qa', icon: 'bi-shield-fill-check', color: '#3B82F6' },
        { name: 'Debugging', level: 92, category: 'qa', icon: 'bi-bug', color: '#EF4444' },
        { name: 'Performance', level: 86, category: 'qa', icon: 'bi-speedometer2', color: '#F59E0B' },
        { name: 'Code Review', level: 88, category: 'qa', icon: 'bi-eye', color: '#8B5CF6' }
      ]
    }
  ];

  // Tools & Technologies
  tools = [
    { name: 'Git', icon: 'bi-git', color: '#F05032' },
    { name: 'Azure', icon: 'bi-cloud', color: '#0089D6' },
    { name: 'VS Code', icon: 'bi-code-square', color: '#007ACC' },
    { name: 'Postman', icon: 'bi-send', color: '#FF6C37' },
    { name: 'Swagger', icon: 'bi-book', color: '#85EA2D' },
    // { name: 'Docker', icon: 'bi-box', color: '#2496ED' }
  ];

  // Stats
  stats = [
    // { label: 'Technologies Mastered', value: '15+', icon: 'bi-stack' },
    { label: 'Years of Experience', value: '1+', icon: 'bi-calendar-check' },
    { label: 'Projects Completed', value: '4+', icon: 'bi-award' },
    { label: 'Happy Clients', value: '3+', icon: 'bi-people' }
  ];

  // Active category for filtering
  activeCategory = signal<string>('all');

  // Animated skill levels
  animatedSkills = signal<Map<string, number>>(new Map());

  ngOnInit() {
    // Animate skill bars on load
    setTimeout(() => this.animateSkillBars(), 500);
  }

  animateSkillBars() {
    const skillMap = new Map<string, number>();
    
    this.skillCategories.forEach(category => {
      category.skills.forEach(skill => {
        let currentLevel = 0;
        const targetLevel = skill.level;
        const increment = targetLevel / 60; // 60 frames animation
        
        const animate = () => {
          if (currentLevel < targetLevel) {
            currentLevel = Math.min(currentLevel + increment, targetLevel);
            skillMap.set(skill.name, currentLevel);
            this.animatedSkills.set(new Map(skillMap));
            requestAnimationFrame(animate);
          }
        };
        
        setTimeout(() => animate(), Math.random() * 500);
      });
    });
  }

  getSkillLevel(skillName: string): number {
    return this.animatedSkills().get(skillName) || 0;
  }

  setActiveCategory(category: string) {
    this.activeCategory.set(category);
  }
}