/**
 * Footer Component
 * Displays organization information and social media links
 */

import { Component, OnInit } from '@angular/core';
import { OrganizationInfo, SocialMediaLinks } from '@core/models';
import { StrapiService } from '@core/services/strapi.service';
import { BRAND_COLORS } from '@core/design-system/brand-colors';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  brandColors = BRAND_COLORS;
  orgInfo: OrganizationInfo | null = null;
  socialMedia: SocialMediaLinks = environment.socialMedia;
  currentYear = new Date().getFullYear();
  loading = true;

  socialPlatforms = [
    { name: 'Facebook', icon: 'fab fa-facebook', key: 'facebook' },
    { name: 'Instagram', icon: 'fab fa-instagram', key: 'instagram' },
    { name: 'Twitter', icon: 'fab fa-twitter', key: 'twitter' },
    { name: 'YouTube', icon: 'fab fa-youtube', key: 'youtube' },
    { name: 'TikTok', icon: 'fab fa-tiktok', key: 'tiktok' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin', key: 'linkedIn' }
  ];

  constructor(private strapiService: StrapiService) {}

  ngOnInit(): void {
    this.loadOrganizationInfo();
  }

  /**
   * Load organization information
   */
  private loadOrganizationInfo(): void {
    this.strapiService.getOrganizationInfo().subscribe(
      (info) => {
        this.orgInfo = info;
        if (info.socialMedia) {
          this.socialMedia = { ...this.socialMedia, ...info.socialMedia };
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading organization info:', error);
        this.loading = false;
      }
    );
  }

  /**
   * Get social media URL
   */
  getSocialMediaUrl(key: string): string | null {
    return (this.socialMedia as Record<string, unknown>)[key] as string | null;
  }

  /**
   * Check if social media link exists
   */
  hasSocialMedia(key: string): boolean {
    const url = this.getSocialMediaUrl(key);
    return !!url;
  }
}
