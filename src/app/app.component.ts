import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
/**
 * Root Application Component
 * Main layout container with navigation and routing
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { BRAND_COLORS } from '@core/design-system/brand-colors';

@Component({
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = false;
  currentRoute: string = '';
  brandColors = BRAND_COLORS;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setupRouting();
    this.setupTheme();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup routing event tracking
   */
  private setupRouting(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: unknown) => {
        const navEvent = event as NavigationEnd;
        this.currentRoute = navEvent.url;
        window.scrollTo(0, 0); // Scroll to top on route change
      });
  }

  /**
   * Setup brand color theme
   */
  private setupTheme(): void {
    // Set CSS variables for dynamic theming
    const root = document.documentElement;
    root.style.setProperty('--color-primary', this.brandColors.primary);
    root.style.setProperty('--color-primary-light', this.brandColors.primaryLight);
    root.style.setProperty('--color-primary-dark', this.brandColors.primaryDark);
    root.style.setProperty('--color-secondary', this.brandColors.secondary);
    root.style.setProperty('--color-secondary-light', this.brandColors.secondaryLight);
    root.style.setProperty('--color-secondary-dark', this.brandColors.secondaryDark);
    root.style.setProperty('--color-accent', this.brandColors.accent);
    root.style.setProperty('--color-accent-light', this.brandColors.accentLight);
    root.style.setProperty('--color-accent-dark', this.brandColors.accentDark);
  }
}
