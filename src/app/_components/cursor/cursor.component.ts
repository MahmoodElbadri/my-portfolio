import { Component, HostListener, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  template: `
    <div class="cursor-dot" 
         [style.left.px]="dotX()" 
         [style.top.px]="dotY()"
         [class.cursor-clicked]="isClicked()"></div>
    <div class="cursor-outline" 
         [style.left.px]="outlineX()" 
         [style.top.px]="outlineY()"
         [class.cursor-hover]="isHovering()"
         [class.cursor-clicked]="isClicked()"></div>
    
    <!-- Cursor Trail Effect -->
    @for (trail of trails(); track trail.id) {
      <div class="cursor-trail"
           [style.left.px]="trail.x"
           [style.top.px]="trail.y"
           [style.animation-delay]="trail.delay + 'ms'"></div>
    }
  `,
  styleUrl: './cursor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CursorComponent implements OnInit {
  // Cursor positions
  dotX = signal(0);
  dotY = signal(0);
  outlineX = signal(0);
  outlineY = signal(0);

  // Interaction states
  isHovering = signal(false);
  isClicked = signal(false);

  // Trail effect
  trails = signal<Array<{id: number, x: number, y: number, delay: number}>>([]);
  private trailId = 0;

  // Smooth following animation
  private targetX = 0;
  private targetY = 0;
  private currentOutlineX = 0;
  private currentOutlineY = 0;

  ngOnInit() {
    // Start smooth animation loop for outline
    this.animateOutline();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    // Update dot position (instant)
    this.dotX.set(x);
    this.dotY.set(y);

    // Update target for outline (smooth follow)
    this.targetX = x;
    this.targetY = y;

    // Create trail effect
    this.createTrail(x, y);

    // Check if hovering over interactive elements
    const target = event.target as HTMLElement;
    const isInteractive = 
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.classList.contains('clickable') ||
      target.closest('a') !== null ||
      target.closest('button') !== null;

    this.isHovering.set(isInteractive);
  }

  @HostListener('window:mousedown')
  onMouseDown() {
    this.isClicked.set(true);
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isClicked.set(false);
  }

  @HostListener('window:mouseleave')
  onMouseLeave() {
    this.isHovering.set(false);
  }

  // Smooth outline animation
  private animateOutline() {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      // Smooth interpolation (ease-out effect)
      this.currentOutlineX = lerp(this.currentOutlineX, this.targetX, 0.15);
      this.currentOutlineY = lerp(this.currentOutlineY, this.targetY, 0.15);

      this.outlineX.set(this.currentOutlineX);
      this.outlineY.set(this.currentOutlineY);

      requestAnimationFrame(animate);
    };

    animate();
  }

  // Create trail particles
  private createTrail(x: number, y: number) {
    const currentTrails = this.trails();
    
    // Add new trail point
    const newTrail = {
      id: this.trailId++,
      x,
      y,
      delay: 0
    };

    const updatedTrails = [...currentTrails, newTrail];

    // Keep only last 8 trail points
    if (updatedTrails.length > 8) {
      updatedTrails.shift();
    }

    this.trails.set(updatedTrails);

    // Remove trail after animation
    setTimeout(() => {
      this.trails.set(this.trails().filter(t => t.id !== newTrail.id));
    }, 600);
  }
}