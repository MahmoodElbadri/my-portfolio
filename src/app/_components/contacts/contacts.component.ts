import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
  hoverColor: string;
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsComponent {
  // Form state
  formData = signal({
    name: '',
    email: '',
    message: ''
  });

  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);

  // Enhanced social links with metadata
  socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      url: 'https://github.com/MahmoodElbadri',
      icon: 'bi-github',
      color: '#333',
      hoverColor: '#6e5494'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/mahmoodelbadri/',
      icon: 'bi-linkedin',
      color: '#0077b5',
      hoverColor: '#00a0dc'
    },
    {
      name: 'Email',
      url: 'mailto:mahmoud@example.com',
      icon: 'bi-envelope-fill',
      color: '#ea4335',
      hoverColor: '#ff6b6b'
    }
  ];

  // Contact info cards
  contactInfo = [
    {
      icon: 'bi-geo-alt-fill',
      title: 'Location',
      value: 'Cairo, Egypt',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: 'bi-clock-fill',
      title: 'Response Time',
      value: 'Within 24 hours',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: 'bi-code-slash',
      title: 'Availability',
      value: 'Open to opportunities',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  async onSubmit(event: Event) {
    event.preventDefault();
    
    this.isSubmitting.set(true);
    this.submitError.set(false);

    try {
      // Netlify Forms handling
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      });

      this.submitSuccess.set(true);
      this.formData.set({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => this.submitSuccess.set(false), 5000);

    } catch (error) {
      this.submitError.set(true);
      setTimeout(() => this.submitError.set(false), 5000);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Input focus animation handler
  onInputFocus(event: FocusEvent) {
    const input = event.target as HTMLElement;
    input.parentElement?.classList.add('focused');
  }

  onInputBlur(event: FocusEvent) {
    const input = event.target as HTMLElement;
    if (!(input as HTMLInputElement).value) {
      input.parentElement?.classList.remove('focused');
    }
  }
}