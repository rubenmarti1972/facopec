/**
 * Brand Color Palette for Fundación Afrocolombiana Pro Encasa
 * Based on African diaspora heritage colors and cultural significance
 * 60-30-10 Color Rule Implementation
 */

export interface BrandColors {
  // Primary Colors (60% - Main brand color)
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary Colors (30% - Supporting color)
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Accent Colors (10% - Highlight color)
  accent: string;
  accentLight: string;
  accentDark: string;
  
  // Neutral Colors
  dark: string;
  darkGray: string;
  mediumGray: string;
  lightGray: string;
  white: string;
  
  // Semantic Colors
  success: string;
  warning: string;
  error: string;
  info: string;
}

/**
 * Fundación Afrocolombiana Pro Encasa Color Palette
 * 
 * PRIMARY (60%): Deep Gold/Ochre (#D4A574) - Represents African heritage, wisdom, and cultural richness
 * SECONDARY (30%): Deep Navy/Midnight (#1B1B4D) - Represents strength, stability, and heritage
 * ACCENT (10%): Vibrant Red/Orange (#E74C3C) - Represents energy, passion, and community
 * 
 * These colors reflect African cultural symbolism:
 * - Gold/Ochre: Ancient African kingdoms, prosperity, and heritage
 * - Navy: Depth of African history and resilience
 * - Red/Orange: Life force, celebration, and communal energy
 */
export const BRAND_COLORS: BrandColors = {
  // Primary: African Gold/Ochre (60%)
  primary: '#D4A574',
  primaryLight: '#E8C9A3',
  primaryDark: '#B88A5F',
  
  // Secondary: Deep Navy/Midnight (30%)
  secondary: '#1B1B4D',
  secondaryLight: '#3D3D7A',
  secondaryDark: '#0F0F2E',
  
  // Accent: Vibrant Red/Orange (10%)
  accent: '#E74C3C',
  accentLight: '#EC7063',
  accentDark: '#C0392B',
  
  // Neutral Colors
  dark: '#2C3E50',
  darkGray: '#34495E',
  mediumGray: '#7F8C8D',
  lightGray: '#ECF0F1',
  white: '#FFFFFF',
  
  // Semantic Colors (with cultural adjustment)
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB'
};

/**
 * Typography Scale following Material Design principles
 */
export const TYPOGRAPHY = {
  // Display sizes for hero sections
  display1: {
    fontSize: '3.5rem',
    fontWeight: 700,
    lineHeight: 1.2
  },
  display2: {
    fontSize: '2.8rem',
    fontWeight: 700,
    lineHeight: 1.3
  },
  
  // Heading sizes
  heading1: {
    fontSize: '2.2rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  heading2: {
    fontSize: '1.8rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  heading3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.5
  },
  heading4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5
  },
  
  // Body text sizes
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6
  },
  body2: {
    fontSize: '0.95rem',
    fontWeight: 400,
    lineHeight: 1.6
  },
  
  // Small text
  caption: {
    fontSize: '0.85rem',
    fontWeight: 400,
    lineHeight: 1.5
  },
  small: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.5
  }
};

/**
 * Spacing scale (8px base unit)
 */
export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
  xxxl: '4rem'
};

/**
 * Border radius scale
 */
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px'
};

/**
 * Shadow definitions for elevation
 */
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  elevation1: '0 2px 4px rgba(0, 0, 0, 0.1)',
  elevation2: '0 4px 8px rgba(0, 0, 0, 0.15)',
  elevation3: '0 8px 16px rgba(0, 0, 0, 0.2)'
};

/**
 * Z-index scale for layering
 */
export const Z_INDEX = {
  hidden: -1,
  base: 0,
  dropdown: 100,
  sticky: 500,
  fixed: 1000,
  modal: 1500,
  popover: 1600,
  tooltip: 1700
};
