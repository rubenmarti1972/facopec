/**
 * Footer Component
 * Displays organization information and social media links
 */

import { Component, OnInit } from '@angular/core';
import { OrganizationInfo, SocialMediaLinks, MediaAsset } from '@core/models';
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

  logoUrl = 'assets/logo.png';
  logoAlt = 'Logo FACOPEC';
  siteName = 'Fundación Afrocolombiana Profe en Casa';
  missionSummary = 'Transformando vidas a través del conocimiento y los valores desde 2020.';
  whatsappUrl = 'https://wa.me/573215230283';
  phoneDisplay = '+57 321 523 0283';
  email = 'contacto@facopec.org';
  addressLine = 'Colombia';
  hoursEntries: Array<{ day: string; schedule: string }> = [
    { day: 'Lunes a Viernes', schedule: '8:00 AM - 5:00 PM' }
  ];

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
        this.siteName = info.name ?? this.siteName;
        this.missionSummary = info.mission ?? this.missionSummary;
        this.phoneDisplay = info.contactPhone ?? this.phoneDisplay;
        this.email = info.contactEmail ?? this.email;

        const whatsappLink = this.buildWhatsappLink(info.contactPhone);
        if (whatsappLink) {
          this.whatsappUrl = whatsappLink;
        }

        const mediaLogo = (info as unknown as { logo?: MediaAsset }).logo;
        const resolvedLogo = this.strapiService.buildMediaUrl(mediaLogo);
        if (resolvedLogo) {
          this.logoUrl = resolvedLogo;
          this.logoAlt = mediaLogo?.alternativeText ?? mediaLogo?.caption ?? this.logoAlt;
        }

        if (info.address && typeof info.address === 'object') {
          const address = info.address as Record<string, unknown>;
          const parts = [address.street, address.city, address.state, address.country]
            .map(part => (typeof part === 'string' ? part : null))
            .filter((part): part is string => !!part);
          if (parts.length) {
            this.addressLine = parts.join(', ');
          }
        }

        if (info.hours && typeof info.hours === 'object') {
          const rawHours = info.hours as Record<string, unknown>;
          const formatted = Object.entries(rawHours)
            .map(([day, schedule]) => ({
              day: this.capitalize(day),
              schedule: typeof schedule === 'string' ? schedule : ''
            }))
            .filter(entry => entry.schedule);

          if (formatted.length) {
            this.hoursEntries = formatted;
          }
        }

        if (info.socialMedia) {
          this.socialMedia = { ...this.socialMedia, ...info.socialMedia };
        }

        const socialLinks = (info as unknown as { socialLinks?: Array<{ platform?: string; url?: string }> }).socialLinks;
        if (Array.isArray(socialLinks)) {
          for (const link of socialLinks) {
            if (link?.platform && link.url) {
              this.socialMedia = {
                ...this.socialMedia,
                [link.platform]: link.url
              } as SocialMediaLinks;
            }
          }
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

  private buildWhatsappLink(phone?: string | null): string | null {
    if (!phone) {
      return null;
    }

    const digits = phone.replace(/\D+/g, '');
    if (!digits) {
      return null;
    }

    let normalized = digits;
    if (normalized.startsWith('00')) {
      normalized = normalized.slice(2);
    }
    if (!normalized.startsWith('57')) {
      normalized = normalized.startsWith('0') ? `57${normalized.slice(1)}` : `57${normalized}`;
    }

    return `https://wa.me/${normalized}`;
  }

  private capitalize(value: string): string {
    if (!value) {
      return value;
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
