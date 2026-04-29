import { Component, ElementRef, ViewChild, AfterViewInit, NgZone, OnDestroy, HostListener, ChangeDetectionStrategy } from '@angular/core';

class Particle {
  constructor(
    public x: number,
    public y: number,
    public dirX: number,
    public dirY: number,
    public size: number,
    public color: string
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(mouse: {x: number, y: number, radius: number}) {
    if (this.x > window.innerWidth || this.x < 0) {
      this.dirX = -this.dirX;
    }
    if (this.y > window.innerHeight || this.y < 0) {
      this.dirY = -this.dirY;
    }

    // Mouse interactivity: push particles away slightly
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < window.innerWidth - this.size * 10) {
        this.x += 1.5;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 1.5;
      }
      if (mouse.y < this.y && this.y < window.innerHeight - this.size * 10) {
        this.y += 1.5;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 1.5;
      }
    }

    this.x += this.dirX * 0.5;
    this.y += this.dirY * 0.5;
  }
}

@Component({
  selector: 'app-particle-web',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  styles: [`
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1; /* Above the aurora background but below everything else */
      pointer-events: none; /* Let clicks pass through */
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticleWebComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationFrameId: number = 0;
  private mouse = { x: -1000, y: -1000, radius: 150 };

  constructor(private ngZone: NgZone) {}

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  @HostListener('window:mouseleave')
  onMouseLeave() {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  @HostListener('window:resize')
  onResize() {
    this.setCanvasSize();
    this.initParticles();
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.setCanvasSize();
    this.initParticles();

    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }

  private setCanvasSize() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initParticles() {
    this.particles = [];
    const numberOfParticles = (window.innerWidth * window.innerHeight) / 10000;
    for (let i = 0; i < numberOfParticles; i++) {
      const size = (Math.random() * 2) + 1;
      const x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
      const y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
      const dirX = (Math.random() * 2) - 1;
      const dirY = (Math.random() * 2) - 1;
      const color = 'rgba(59, 130, 246, 0.8)'; // Blueish

      this.particles.push(new Particle(x, y, dirX, dirY, size, color));
    }
  }

  private animate = () => {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.mouse);
      this.particles[i].draw(this.ctx);
    }
    this.connect();
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  private connect() {
    let opacityValue = 1;
    for (let a = 0; a < this.particles.length; a++) {
      // Connect particles to each other
      for (let b = a; b < this.particles.length; b++) {
        let distance = ((this.particles[a].x - this.particles[b].x) * (this.particles[a].x - this.particles[b].x))
                     + ((this.particles[a].y - this.particles[b].y) * (this.particles[a].y - this.particles[b].y));
        if (distance < 12000) {
          opacityValue = 1 - (distance / 12000);
          this.ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.4})`; // Violet web
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
          this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
          this.ctx.stroke();
        }
      }
      // Connect particles to mouse
      if (this.mouse.x !== -1000) {
        let mouseDist = ((this.particles[a].x - this.mouse.x) * (this.particles[a].x - this.mouse.x))
                      + ((this.particles[a].y - this.mouse.y) * (this.particles[a].y - this.mouse.y));
        if (mouseDist < 25000) { // Link distance to mouse
           opacityValue = 1 - (mouseDist / 25000);
           this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue * 0.8})`; // Blue stronger line to mouse
           this.ctx.lineWidth = 1.2;
           this.ctx.beginPath();
           this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
           this.ctx.lineTo(this.mouse.x, this.mouse.y);
           this.ctx.stroke();
        }
      }
    }
  }
}
        