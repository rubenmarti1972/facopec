/**
 * Root Application Component
 * Main layout container with navigation and routing
 */

import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { StrapiService } from '@core/services/strapi.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { BRAND_COLORS } from '@core/design-system/brand-colors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly strapiService = inject(StrapiService);
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

  /**
   * Listen for Ctrl+Shift+R or Cmd+Shift+R to force refresh content
   * This bypasses all caches (browser, Angular, RxJS)
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'R') {
      event.preventDefault();
      console.log('🔄 Forcing content refresh (all caches cleared)...');
      this.strapiService.refreshAllContent();
      window.location.reload();
    }
  }
}
