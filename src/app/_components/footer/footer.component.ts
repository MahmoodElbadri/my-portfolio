import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
private scroller = inject(ViewportScroller);
  protected time = new Date().getFullYear();
  
  // سيجنال للتحكم في ظهور السهم
  showScrollBtn = signal(false);

  // مراقبة السكرول عشان نظهر السهم بعد 400px مثلاً
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollBtn.set(window.scrollY > 400);
  }

  scrollToTop() {
    this.scroller.scrollToPosition([0, 0]);
  }
}
