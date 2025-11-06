/**
 * Content Management System Interfaces
 * Defines all data models with strict TypeScript typing
 */

// ============================================================================
// MULTIMEDIA CONTENT TYPES
// ============================================================================

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  duration?: number; // For videos, in seconds
  uploadedAt: Date;
  category: MediaCategory;
  featured?: boolean;
}

export type MediaType = 'video' | 'photograph' | 'image' | 'document';
export type MediaCategory = 'proyecto' | 'evento' | 'testimonio' | 'recurso' | 'galeria' | 'otro';

// ============================================================================
// PROJECT INTERFACES
// ============================================================================

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  objective: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  beneficiaries?: number;
  images: MediaItem[];
  videos: MediaItem[];
  testimonials: Testimonial[];
  impact: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 'active' | 'completed' | 'planning' | 'on-hold';

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  rating?: number; // 1-5
  date: Date;
  image?: string;
}

// ============================================================================
// SPONSORSHIP INTERFACES
// ============================================================================

export interface Sponsor {
  id: string;
  name: string;
  description: string;
  logo: string;
  website?: string;
  contactEmail: string;
  sponsorshipLevel: SponsorshipLevel;
  projects: string[]; // Project IDs
  startDate: Date;
  endDate?: Date;
  active: boolean;
}

export type SponsorshipLevel = 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';

export interface SponsorshipPackage {
  id: string;
  level: SponsorshipLevel;
  name: string;
  description: string;
  benefits: string[];
  price: number;
  visibility: VisibilityLevel;
}

export type VisibilityLevel = 'premium' | 'standard' | 'basic';

// ============================================================================
// GRANT INTERFACES
// ============================================================================

export interface Grant {
  id: string;
  title: string;
  description: string;
  agency: string;
  maxAmount: number;
  deadline: Date;
  eligibility: string;
  applicationProcess: string;
  documents: MediaItem[];
  status: GrantStatus;
  awardAmount?: number;
  awardDate?: Date;
  createdAt: Date;
}

export type GrantStatus = 'open' | 'closed' | 'awarded' | 'rejected' | 'pending-review';

// ============================================================================
// LITERARY INITIATIVE INTERFACES
// ============================================================================

export interface LiteraryRoute {
  id: string;
  name: string; // La Ruta Literaria María
  description: string;
  objective: string;
  activities: LiteraryActivity[];
  books: Book[];
  authors: Author[];
  participants?: number;
  startDate: Date;
  endDate?: Date;
  active: boolean;
  images: MediaItem[];
  videos: MediaItem[];
}

export interface LiteraryActivity {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  speaker?: string;
  participants?: number;
  resources: MediaItem[];
  type: 'reading' | 'workshop' | 'discussion' | 'presentation' | 'event';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  isbn?: string;
  publicationYear: number;
  themes: string[];
}

export interface Author {
  id: string;
  name: string;
  biography: string;
  birthDate?: Date;
  photograph?: string;
  publications: string[]; // Book IDs
  socialMedia?: SocialMediaLinks;
}

// ============================================================================
// DONATION & PAYMENT INTERFACES
// ============================================================================

export interface Donation {
  id: string;
  donorId?: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  timestamp: Date;
  projectId?: string; // If donation is for specific project
  message?: string;
  isAnonymous: boolean;
  receiptEmail?: string;
}

export type Currency = 'USD' | 'COP' | 'EUR';
export type PaymentMethod = 'paypal' | 'womans-bank' | 'card' | 'transfer';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export interface PayPalPaymentData {
  orderId: string;
  amount: number;
  currency: Currency;
  donorEmail: string;
  donorName: string;
  description: string;
}

export interface WomansBankPaymentData {
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountHolder: string;
  description: string;
}

// ============================================================================
// FINANCIAL RECORD INTERFACES
// ============================================================================

export interface FinancialRecord {
  id: string;
  type: FinancialType;
  category: FinancialCategory;
  amount: number;
  currency: Currency;
  description: string;
  relatedId?: string; // Donation ID, Grant ID, etc.
  createdAt: Date;
  approvedBy?: string;
  approvalDate?: Date;
  status: RecordStatus;
  notes?: string;
}

export type FinancialType = 'income' | 'expense' | 'grant' | 'donation';
export type FinancialCategory = 'donation' | 'grant-award' | 'program-expense' | 'operational' | 'staff' | 'equipment' | 'other';
export type RecordStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  donationCount: number;
  averageDonation: number;
  currencyBreakdown: Record<Currency, number>;
  paymentMethodBreakdown: Record<PaymentMethod, number>;
  periodStart: Date;
  periodEnd: Date;
}

// ============================================================================
// ACCOUNT/USER INTERFACES
// ============================================================================

export interface UserAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  accountType: AccountType;
  profilePicture?: string;
  bio?: string;
  phone?: string;
  createdAt: Date;
  lastLogin?: Date;
  active: boolean;
  preferences: UserPreferences;
}

export type UserRole = 'admin' | 'staff' | 'volunteer' | 'donor' | 'guest';
export type AccountType = 'individual' | 'organization' | 'staff';

export interface UserPreferences {
  emailNotifications: boolean;
  newsletter: boolean;
  language: Language;
  theme: 'light' | 'dark';
}

export type Language = 'es' | 'en' | 'fr';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: UserAccount;
}

// ============================================================================
// NEWS/BLOG INTERFACES
// ============================================================================

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  status: PublicationStatus;
  comments: Comment[];
  views: number;
}

export type PublicationStatus = 'draft' | 'published' | 'archived' | 'scheduled';

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: Date;
  approved: boolean;
  replies?: Comment[];
}

// ============================================================================
// ORGANIZATION INFO INTERFACES
// ============================================================================

export interface OrganizationInfo {
  id: string;
  name: string;
  mission: string;
  vision: string;
  history: string;
  values: string[];
  team: TeamMember[];
  contactInfo: ContactInfo;
  socialMedia: SocialMediaLinks;
  logo: string;
  banner: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  photograph: string;
  socialMedia?: SocialMediaLinks;
  department: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  phoneAlternate?: string;
  address: Address;
  hours: BusinessHours;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedIn?: string;
  youtube?: string;
  tiktok?: string;
}

// ============================================================================
// CMS VIEW MODELS (STRAPI SINGLE TYPES)
// ============================================================================

export interface MediaAsset {
  id?: number;
  url?: string;
  alternativeText?: string;
  caption?: string;
  mime?: string;
  formats?: Record<string, unknown>;
}

export interface NavigationLink {
  id?: number;
  label: string;
  url: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface SocialLink {
  id?: number;
  platform: string;
  url: string;
  label?: string;
}

export interface HeroActionContent {
  id?: number;
  label: string;
  url: string;
  variant?: 'primary' | 'secondary';
  isInternal?: boolean;
  dataUid?: string;
}

export interface HeroStatContent {
  id?: number;
  label: string;
  value: string;
}

export interface HeroSectionContent {
  eyebrow?: string;
  titleLines?: { line: string }[];
  lead?: string;
  stats?: HeroStatContent[];
  actions?: HeroActionContent[];
  verse?: {
    reference?: string;
    text?: string;
    description?: string;
  };
  image?: MediaAsset;
}

export interface HighlightContent {
  id?: number;
  icon?: string;
  title: string;
  description?: string;
  label?: string;
  theme?: string;
  dataUid?: string;
}

export interface IdentityValueContent {
  id?: number;
  title: string;
  description?: string;
  icon?: string;
  dataUid?: string;
}

export interface IdentityContent {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  dataUid?: string;
  values?: IdentityValueContent[];
}

export interface MissionVisionContent {
  mission?: string;
  missionUid?: string;
  vision?: string;
  visionUid?: string;
}

export interface ActivityCardContent {
  id?: number;
  title: string;
  description?: string;
  icon?: string;
  theme?: string;
  link?: string;
  dataUid?: string;
}

export interface ProgramCardContent {
  id?: number;
  title: string;
  description?: string;
  highlights?: string[];
  link?: string;
  strapiCollection?: string;
  strapiEntryId?: string;
}

export interface SupporterLogoContent {
  id?: number;
  name?: string;
  caption?: string;
  link?: string;
  logo?: MediaAsset;
  dataUid?: string;
}

export interface CatalogItemContent {
  id?: number;
  title: string;
  description?: string;
  price?: string;
  link?: string;
  strapiCollection?: string;
  strapiEntryId?: string;
}

export interface GalleryItemContent {
  id?: number;
  title: string;
  description?: string;
  type?: 'image' | 'video';
  link?: string;
  media?: MediaAsset;
  strapiCollection?: string;
  strapiEntryId?: string;
}

export interface HomePageContent {
  id?: number;
  hero?: HeroSectionContent;
  impactHighlights?: HighlightContent[];
  identity?: IdentityContent;
  missionVision?: MissionVisionContent;
  activities?: ActivityCardContent[];
  programs?: ProgramCardContent[];
  supporters?: SupporterLogoContent[];
  catalog?: CatalogItemContent[];
  gallery?: GalleryItemContent[];
}

export interface DonationMetricContent {
  id?: number;
  value: string;
  label: string;
  dataUid?: string;
}

export interface DonationHighlightContent {
  id?: number;
  icon?: string;
  title: string;
  description?: string;
  theme?: string;
  dataUid?: string;
}

export interface DonationStoryContent {
  id?: number;
  title: string;
  description?: string;
  impact?: string;
  link?: string;
  cover?: MediaAsset;
  strapiCollection?: string;
  strapiEntryId?: string;
}

export interface SupportActionContent {
  id?: number;
  icon?: string;
  title: string;
  description?: string;
  link?: string;
  linkLabel?: string;
  theme?: string;
  dataUid?: string;
}

export interface PaymentGatewayContent {
  id?: number;
  name: string;
  description?: string;
  link?: string;
  actionLabel?: string;
  badge?: string;
  theme?: string;
}

export interface DonationAmount {
  id?: number;
  value: number;
  label: string;
  icon?: string;
  impact?: string;
}

export interface DonationsPageContent {
  id?: number;
  heroTitle?: string;
  heroSubtitle?: string;
  donationAmounts?: DonationAmount[];
  metrics?: DonationMetricContent[];
  highlights?: DonationHighlightContent[];
  stories?: DonationStoryContent[];
  supportActions?: SupportActionContent[];
  paymentGateways?: PaymentGatewayContent[];
}

export interface GlobalSettings {
  id?: number;
  siteName?: string;
  appUrl?: string;
  logo?: MediaAsset;
  navigation?: NavigationLink[];
  socialLinks?: SocialLink[];
}

export interface ProjectCardSummary {
  id?: number;
  title: string;
  description?: string;
  tag?: string;
  link?: string;
  order?: number;
  cover?: MediaAsset;
}

// ============================================================================
// STRAPI RESPONSE INTERFACES
// ============================================================================

export interface StrapiResponse<T> {
  data: T | T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
