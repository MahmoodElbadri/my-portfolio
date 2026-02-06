import { Component, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { NavbarComponent } from "./_components/navbar/navbar.component";
import { HeroComponent } from "./_components/hero/hero.component";
import { ProjectsCarouselComponent } from "./_components/projects-carousel/projects-carousel.component";
import { SkillsComponent } from "./_components/skills/skills.component";
import { ContactsComponent } from "./_components/contacts/contacts.component";
import { FooterComponent } from "./_components/footer/footer.component";
import { CursorComponent } from "./_components/cursor/cursor.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, HeroComponent, ProjectsCarouselComponent, SkillsComponent, ContactsComponent, FooterComponent, CursorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Ensure this matches your file name (.scss or .css)
})
export class AppComponent {

  private scroller = inject(ViewportScroller);

  scrollTo(sectionId: string) {
    this.scroller.scrollToAnchor(sectionId);
  }

  currentYear = new Date().getFullYear();
}