import { Component, ElementRef, ViewChild, AfterViewInit, NgZone, OnDestroy, HostListener, ChangeDetectionStrategy } from '@angular/core';

class Spark {
  public x: number;
  public y: number;
  public dirX: number;
  public dirY: number;
  public size: number;
  public color: string;
  public alpha: number = 1.0;
  public decay: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    // Spark starburst vectors
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 2.5;
    this.dirX = Math.cos(angle) * speed;
    this.dirY = Math.sin(angle) * speed;

    this.size = Math.random() * 3 + 2.2;

    // Glowing cyber neon colors
    const colors = [
      'rgba(6, 182, 212, ALPHA)',  // Cyber Cyan
      'rgba(236, 72, 153, ALPHA)', // Hot Pink
      'rgba(168, 85, 247, ALPHA)', // Neon Violet
      'rgba(250, 204, 21, ALPHA)'  // Twinkling Gold
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.decay = Math.random() * 0.02 + 0.018;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color.replace('ALPHA', this.alpha.toFixed(2));

    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color.replace('ALPHA', '0.9');

    ctx.fill();
    ctx.restore();
  }

  update() {
    this.x += this.dirX;
    this.y += this.dirY;

    // Soft air drag & gravity pull
    this.dirX *= 0.97;
    this.dirY *= 0.97;
    this.dirY += 0.06; // subtle gravity

    this.alpha -= this.decay;
  }
}

interface GridPoint {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
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
      z-index: 1; /* Under cursor outline but above aurora background */
      pointer-events: none; /* Ignore click blockages */
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticleWebComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private gridPoints: GridPoint[] = [];
  private sparks: Spark[] = [];
  private animationFrameId: number = 0;
  private mouse = { x: -1000, y: -1000 };

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
    this.initGrid();
  }

  @HostListener('window:mousedown', ['$event'])
  onWindowClick(event: MouseEvent) {
    // Spectacular starburst explosion on mouse clicks
    for (let i = 0; i < 28; i++) {
      this.sparks.push(new Spark(event.clientX, event.clientY));
    }
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.setCanvasSize();
    this.initGrid();

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

  private initGrid() {
    this.gridPoints = [];
    const spacing = 45; // grid cell density
    const cols = Math.ceil(window.innerWidth / spacing) + 2;
    const rows = Math.ceil(window.innerHeight / spacing) + 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - 0.5) * spacing;
        const y = (r - 0.5) * spacing;
        this.gridPoints.push({
          x,
          y,
          baseX: x,
          baseY: y
        });
      }
    }
  }

  private animate = () => {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const radius = 220; // mouse gravity influence radius
    const spacing = 45;
    const cols = Math.ceil(window.innerWidth / spacing) + 2;
    const rows = Math.ceil(window.innerHeight / spacing) + 2;

    // 1. Spacetime gravity grid warp physics
    for (let i = 0; i < this.gridPoints.length; i++) {
      const pt = this.gridPoints[i];
      if (this.mouse.x !== -1000) {
        const dx = this.mouse.x - pt.baseX;
        const dy = this.mouse.y - pt.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          const force = (radius - distance) / radius;
          const angle = Math.atan2(dy, dx);
          // Pull spacetime coordinate points towards mouse
          const warp = force * 38;
          pt.x = pt.baseX + Math.cos(angle) * warp;
          pt.y = pt.baseY + Math.sin(angle) * warp;
        } else {
          pt.x += (pt.baseX - pt.x) * 0.12;
          pt.y += (pt.baseY - pt.y) * 0.12;
        }
      } else {
        pt.x += (pt.baseX - pt.x) * 0.12;
        pt.y += (pt.baseY - pt.y) * 0.12;
      }
    }

    // 2. Draw horizontal warp lines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const idxA = r * cols + c;
        const idxB = r * cols + (c + 1);
        if (idxA < this.gridPoints.length && idxB < this.gridPoints.length) {
          const ptA = this.gridPoints[idxA];
          const ptB = this.gridPoints[idxB];

          const avgX = (ptA.x + ptB.x) / 2;
          const avgY = (ptA.y + ptB.y) / 2;
          const mouseDist = this.mouse.x !== -1000 ? Math.sqrt((avgX - this.mouse.x) * (avgX - this.mouse.x) + (avgY - this.mouse.y) * (avgY - this.mouse.y)) : 1000;

          if (mouseDist < radius) {
            const glow = (radius - mouseDist) / radius;
            this.ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 + glow * 0.44})`; // Glowing cyan on warp
            this.ctx.lineWidth = 0.65 + glow * 0.75;
          } else {
            this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.11)'; // default soft resting purple
            this.ctx.lineWidth = 0.65;
          }

          this.ctx.beginPath();
          this.ctx.moveTo(ptA.x, ptA.y);
          this.ctx.lineTo(ptB.x, ptB.y);
          this.ctx.stroke();
        }
      }
    }

    // 3. Draw vertical warp lines
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 1; r++) {
        const idxA = r * cols + c;
        const idxB = (r + 1) * cols + c;
        if (idxA < this.gridPoints.length && idxB < this.gridPoints.length) {
          const ptA = this.gridPoints[idxA];
          const ptB = this.gridPoints[idxB];

          const avgX = (ptA.x + ptB.x) / 2;
          const avgY = (ptA.y + ptB.y) / 2;
          const mouseDist = this.mouse.x !== -1000 ? Math.sqrt((avgX - this.mouse.x) * (avgX - this.mouse.x) + (avgY - this.mouse.y) * (avgY - this.mouse.y)) : 1000;

          if (mouseDist < radius) {
            const glow = (radius - mouseDist) / radius;
            this.ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 + glow * 0.44})`;
            this.ctx.lineWidth = 0.65 + glow * 0.75;
          } else {
            this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.11)';
            this.ctx.lineWidth = 0.65;
          }

          this.ctx.beginPath();
          this.ctx.moveTo(ptA.x, ptA.y);
          this.ctx.lineTo(ptB.x, ptB.y);
          this.ctx.stroke();
        }
      }
    }

    // 4. Draw click sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      this.sparks[i].update();
      if (this.sparks[i].alpha <= 0) {
        this.sparks.splice(i, 1);
      } else {
        this.sparks[i].draw(this.ctx);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}
        