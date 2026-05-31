import { Component, HostListener, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';

export interface TrailPoint {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  glowColor: string;
  opacity: number;
}

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  template: `
    <!-- Center Dot -->
    <div class="cursor-dot" 
         [style.left.px]="dotX()" 
         [style.top.px]="dotY()"
         [class.cursor-clicked]="isClicked()"></div>
         
    <!-- Outer Ring (Cyan / Slow Spring) -->
    <div class="cursor-outline outer" 
         [style.left.px]="outerX()" 
         [style.top.px]="outerY()"
         [style.width.px]="outerWidth()"
         [style.height.px]="outerHeight()"
         [style.border-radius]="outerBorderRadius()"
         [style.transform]="outerTransform()"
         [class.cursor-hover]="isHovering()"
         [class.cursor-clicked]="isClicked()"></div>

    <!-- Inner Ring (Pink / Snappy Spring) -->
    <div class="cursor-outline inner" 
         [style.left.px]="innerX()" 
         [style.top.px]="innerY()"
         [style.width.px]="innerWidth()"
         [style.height.px]="innerHeight()"
         [style.border-radius]="innerBorderRadius()"
         [style.transform]="innerTransform()"
         [class.cursor-hover]="isHovering()"
         [class.cursor-clicked]="isClicked()"></div>
    
    <!-- Stardust Sparkling Embers Trail -->
    @for (trail of trails(); track trail.id) {
      <div class="cursor-trail"
           [style.left.px]="trail.x"
           [style.top.px]="trail.y"
           [style.width.px]="trail.size"
           [style.height.px]="trail.size"
           [style.opacity]="trail.opacity"
           [style.background]="trail.color"
           [style.box-shadow]="'0 0 10px ' + trail.glowColor"></div>
    }
  `,
  styleUrl: './cursor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CursorComponent implements OnInit {
  // Cursor positions
  dotX = signal(0);
  dotY = signal(0);
  
  // Outer Ring (Cyan) Positions and Layout
  outerX = signal(0);
  outerY = signal(0);
  outerWidth = signal(40);
  outerHeight = signal(40);
  outerBorderRadius = signal('50%');
  outerTransform = signal('translate(-50%, -50%)');

  // Inner Ring (Pink) Positions and Layout
  innerX = signal(0);
  innerY = signal(0);
  innerWidth = signal(26);
  innerHeight = signal(26);
  innerBorderRadius = signal('50%');
  innerTransform = signal('translate(-50%, -50%)');

  // Interaction states
  isHovering = signal(false);
  isClicked = signal(false);
  isSnapped = signal(false);

  // Trails signal
  trails = signal<TrailPoint[]>([]);
  private trailId = 0;

  // Cursor Targets
  private targetX = 0;
  private targetY = 0;

  // Snapping Target Dimensions
  private snapTargetX = 0;
  private snapTargetY = 0;
  private snapTargetWidth = 40;
  private snapTargetHeight = 40;

  // Outer Ring Spring Physics (Soft, lazy spring)
  private outerX_val = 0;
  private outerY_val = 0;
  private outerVx = 0;
  private outerVy = 0;
  private outerStiffness = 0.07;
  private outerDamping = 0.74;

  // Inner Ring Spring Physics (Snappy, quick spring)
  private innerX_val = 0;
  private innerY_val = 0;
  private innerVx = 0;
  private innerVy = 0;
  private innerStiffness = 0.15;
  private innerDamping = 0.8;

  ngOnInit() {
    this.animateOutline();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    this.dotX.set(x);
    this.dotY.set(y);

    this.targetX = x;
    this.targetY = y;

    this.createTrail(x, y);

    // Hover snap detection
    const target = event.target as HTMLElement;
    const clickable = target.closest('a, button, .clickable, .glass-button') as HTMLElement;

    if (clickable) {
      this.isHovering.set(true);
      this.isSnapped.set(true);

      const rect = clickable.getBoundingClientRect();
      this.snapTargetX = rect.left + rect.width / 2;
      this.snapTargetY = rect.top + rect.height / 2;

      this.snapTargetWidth = rect.width + 12;
      this.snapTargetHeight = rect.height + 12;

      const computedStyle = window.getComputedStyle(clickable);
      const radius = computedStyle.borderRadius || '8px';
      this.outerBorderRadius.set(radius);
      this.innerBorderRadius.set(radius);
    } else {
      this.isHovering.set(false);
      this.isSnapped.set(false);
    }
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
    this.isSnapped.set(false);
  }

  // Smooth Dual Spring Physics Animation Loop
  private animateOutline() {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      // 1. Outer Ring Calculations
      if (this.isSnapped()) {
        this.outerX_val = lerp(this.outerX_val, this.snapTargetX, 0.2);
        this.outerY_val = lerp(this.outerY_val, this.snapTargetY, 0.2);

        const w = lerp(this.outerWidth(), this.snapTargetWidth, 0.2);
        const h = lerp(this.outerHeight(), this.snapTargetHeight, 0.2);
        this.outerWidth.set(w);
        this.outerHeight.set(h);

        this.outerTransform.set('translate(-50%, -50%)');
      } else {
        // Apply spring physics to Outer Ring
        const ax = (this.targetX - this.outerX_val) * this.outerStiffness;
        const ay = (this.targetY - this.outerY_val) * this.outerStiffness;
        this.outerVx = (this.outerVx + ax) * this.outerDamping;
        this.outerVy = (this.outerVy + ay) * this.outerDamping;
        this.outerX_val += this.outerVx;
        this.outerY_val += this.outerVy;

        const w = lerp(this.outerWidth(), 40, 0.2);
        const h = lerp(this.outerHeight(), 40, 0.2);
        this.outerWidth.set(w);
        this.outerHeight.set(h);
        this.outerBorderRadius.set('50%');

        // Squash & Stretch based on velocity vector
        const speed = Math.sqrt(this.outerVx * this.outerVx + this.outerVy * this.outerVy);
        const angle = Math.atan2(this.outerVy, this.outerVx);
        const stretch = 1 + speed * 0.035;
        const squeeze = 1 - speed * 0.022;

        this.outerTransform.set(
          `translate(-50%, -50%) rotate(${angle}rad) scale(${stretch}, ${squeeze})`
        );
      }
      this.outerX.set(this.outerX_val);
      this.outerY.set(this.outerY_val);

      // 2. Inner Ring Calculations
      if (this.isSnapped()) {
        this.innerX_val = lerp(this.innerX_val, this.snapTargetX, 0.26);
        this.innerY_val = lerp(this.innerY_val, this.snapTargetY, 0.26);

        const w = lerp(this.innerWidth(), this.snapTargetWidth - 8, 0.26);
        const h = lerp(this.innerHeight(), this.snapTargetHeight - 8, 0.26);
        this.innerWidth.set(w);
        this.innerHeight.set(h);

        this.innerTransform.set('translate(-50%, -50%)');
      } else {
        // Apply spring physics to Snappy Inner Ring
        const ax = (this.targetX - this.innerX_val) * this.innerStiffness;
        const ay = (this.targetY - this.innerY_val) * this.innerStiffness;
        this.innerVx = (this.innerVx + ax) * this.innerDamping;
        this.innerVy = (this.innerVy + ay) * this.innerDamping;
        this.innerX_val += this.innerVx;
        this.innerY_val += this.innerVy;

        const w = lerp(this.innerWidth(), 26, 0.22);
        const h = lerp(this.innerHeight(), 26, 0.22);
        this.innerWidth.set(w);
        this.innerHeight.set(h);
        this.innerBorderRadius.set('50%');

        const speed = Math.sqrt(this.innerVx * this.innerVx + this.innerVy * this.innerVy);
        const angle = Math.atan2(this.innerVy, this.innerVx);
        const stretch = 1 + speed * 0.02;
        const squeeze = 1 - speed * 0.012;

        this.innerTransform.set(
          `translate(-50%, -50%) rotate(${angle}rad) scale(${stretch}, ${squeeze})`
        );
      }
      this.innerX.set(this.innerX_val);
      this.innerY.set(this.innerY_val);

      // 3. Update and filter sparkling stardust trail
      const updatedTrails = this.trails()
        .map((t) => {
          t.x += t.vx;
          t.y += t.vy;
          t.vx *= 0.95; // drag resistance
          t.vy *= 0.95;
          t.vy -= 0.035; // gentle float upward like real glowing embers
          t.opacity -= 0.015; // smooth fade
          t.size = Math.max(0, t.size - 0.07); // dynamic shrink
          return t;
        })
        .filter((t) => t.opacity > 0 && t.size > 0);

      // Bound size of trails to 40 items for solid 60fps performance
      if (updatedTrails.length > 40) {
        updatedTrails.splice(0, updatedTrails.length - 40);
      }
      this.trails.set(updatedTrails);

      requestAnimationFrame(animate);
    };

    animate();
  }

  private createTrail(x: number, y: number) {
    const currentTrails = this.trails();
    const colors = [
      'linear-gradient(135deg, #06b6d4, #3b82f6)', // Cyber Cyan-Blue
      'linear-gradient(135deg, #ec4899, #8b5cf6)', // Hot Pink-Violet
      'linear-gradient(135deg, #facc15, #f59e0b)'  // Golden Ember
    ];
    const glowColors = ['#06b6d4', '#ec4899', '#facc15'];
    const idx = Math.floor(Math.random() * colors.length);

    // Spawn 2 drifting embers per move
    const newTrails: TrailPoint[] = [];
    for (let i = 0; i < 2; i++) {
      newTrails.push({
        id: this.trailId++,
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 3,
        color: colors[idx],
        glowColor: glowColors[idx],
        opacity: 0.8
      });
    }

    this.trails.set([...currentTrails, ...newTrails]);
  }
}