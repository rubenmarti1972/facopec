/**
 * Strapi CMS Integration Service
 * Manages all API communication with Strapi backend
 * Implements caching and error handling
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap, shareReplay, timeout } from 'rxjs/operators';
import {
  Project,
  MediaItem,
  Grant,
  LiteraryRoute,
  NewsArticle,
  Donation,
  Sponsor,
  StrapiResponse,
  StrapiError,
  OrganizationInfo,
  MediaAsset,
  HomePageContent,
  DonationsPageContent,
  GlobalSettings,
  ProjectCardSummary
} from '../models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  private readonly apiUrl = environment.strapi?.url ?? (environment as unknown as { strapiUrl?: string }).strapiUrl ?? '';
  private readonly publicUrl = environment.strapi?.publicUrl ?? this.apiUrl;
  private readonly apiKey = environment.strapi?.apiToken ?? '';
  private readonly previewToken = environment.strapi?.previewToken ?? '';
  private readonly cacheDurationMs = Math.max(
    0,
    Number(
      environment.strapi?.cacheDurationMs ?? (environment.production ? 5 * 60 * 1000 : 0)
    )
  );
  private readonly cacheEnabled = Number.isFinite(this.cacheDurationMs) && this.cacheDurationMs > 0;

  // Request timeout in milliseconds (5 seconds default)
  // If CMS doesn't respond within this time, fallback to assets
  private readonly requestTimeoutMs = environment.strapi?.requestTimeoutMs ?? 5000;

  // Cache management
  private cacheMap = new Map<string, Observable<unknown>>();
  private cacheTimestamps = new Map<string, number>();

  // Error handling
  public errors$ = new BehaviorSubject<StrapiError | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la configuración global (navegación, redes, etc.).
   */
  public getGlobalSettings(): Observable<GlobalSettings> {
    return this.fetchSingleType<GlobalSettings>('global');
  }

  /**
   * Obtiene el contenido de la página de inicio.
   */
  public getHomePage(): Observable<HomePageContent> {
    return this.fetchSingleType<HomePageContent>('home-page');
  }

  /**
   * Obtiene el contenido de la página de donaciones.
   */
  public getDonationsPage(): Observable<DonationsPageContent> {
    return this.fetchSingleType<DonationsPageContent>('donations-page');
  }

  /**
   * Get all projects with optional filters
   */
  public getProjects(
    filters?: { status?: string; category?: string },
    limit: number = 100,
    start: number = 0
  ): Observable<Project[]> {
    return this.getCachedData(
      `projects-${JSON.stringify(filters)}-${limit}-${start}`,
      () => this.buildRequest<Project[]>(
        '/api/projects',
        { populate: '*', limit, start, ...this.buildFilters(filters) }
      )
    );
  }

  /**
   * Get single project by ID
   */
  public getProject(id: string): Observable<Project> {
    return this.getCachedData(
      `project-${id}`,
      () => this.buildRequest<Project>(`/api/projects/${id}`, { populate: '*' })
    );
  }

  /**
   * Obtiene tarjetas públicas de proyectos simplificadas
   */
  public getProjectSummaries(limit: number = 50): Observable<ProjectCardSummary[]> {
    return this.getCachedData(
      `project-summaries-${limit}`,
      () =>
        this.buildRequest<ProjectCardSummary[]>(
          '/api/projects',
          { populate: '*', sort: 'order:asc', 'pagination[pageSize]': limit }
        )
    );
  }

  /**
   * Get all media items
   */
  public getMediaItems(
    category?: string,
    type?: string,
    limit: number = 50
  ): Observable<MediaItem[]> {
    return this.getCachedData(
      `media-${category}-${type}-${limit}`,
      () => {
        const filters: Record<string, unknown> = { limit, populate: '*' };
        if (category) filters['filters[category][$eq]'] = category;
        if (type) filters['filters[type][$eq]'] = type;
        return this.buildRequest<MediaItem[]>('/api/media-items', filters);
      }
    );
  }

  /**
   * Upload media item to Strapi
   */
  public uploadMediaItem(file: File, metadata: Partial<MediaItem>): Observable<MediaItem> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('metadata', JSON.stringify(metadata));

    const headers = this.getHeaders({ contentType: undefined });
    delete headers['Content-Type'];

    const baseUrl = this.apiUrl || this.publicUrl || '';

    return this.http.post<StrapiResponse<MediaItem>>(
      `${baseUrl}/api/upload`,
      formData,
      { headers }
    ).pipe(
      map(response => Array.isArray(response.data) ? response.data[0] : response.data),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get all grants
   */
  public getGrants(
    filters?: { status?: string },
    limit: number = 50
  ): Observable<Grant[]> {
    return this.getCachedData(
      `grants-${JSON.stringify(filters)}-${limit}`,
      () => this.buildRequest<Grant[]>(
        '/api/grants',
        { populate: '*', limit, ...this.buildFilters(filters) }
      )
    );
  }

  /**
   * Get single grant
   */
  public getGrant(id: string): Observable<Grant> {
    return this.getCachedData(
      `grant-${id}`,
      () => this.buildRequest<Grant>(`/api/grants/${id}`, { populate: '*' })
    );
  }

  /**
   * Get literary route information
   */
  public getLiteraryRoute(): Observable<LiteraryRoute> {
    return this.getCachedData(
      'literary-route',
      () => this.buildRequest<LiteraryRoute>(
        '/api/literary-route',
        { populate: 'deep' }
      )
    );
  }

  /**
   * Get all news articles
   */
  public getNewsArticles(
    limit: number = 20,
    start: number = 0,
    status: string = 'published'
  ): Observable<NewsArticle[]> {
    return this.getCachedData(
      `news-${limit}-${start}-${status}`,
      () => this.buildRequest<NewsArticle[]>(
        '/api/news-articles',
        {
          populate: '*',
          limit,
          start,
          'filters[status][$eq]': status,
          'sort[0]': 'publishedAt:desc'
        }
      )
    );
  }

  /**
   * Get single news article
   */
  public getNewsArticle(slug: string): Observable<NewsArticle> {
    return this.buildRequest<NewsArticle[]>(
      '/api/news-articles',
      {
        populate: '*',
        'filters[slug][$eq]': slug
      }
    ).pipe(
      map(articles => {
        const normalizedArticles = Array.isArray(articles) ? articles : [articles];
        const [firstArticle] = normalizedArticles;
        if (firstArticle) {
          return firstArticle;
        }
        throw new Error('Article not found');
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get organization information
   */
  public getOrganizationInfo(): Observable<OrganizationInfo> {
    return this.getCachedData(
      'org-info',
      () => this.buildRequest<OrganizationInfo>(
        '/api/organization-info',
        { populate: 'deep' }
      )
    );
  }

  /**
   * Get all sponsors
   */
  public getSponsors(): Observable<Sponsor[]> {
    return this.getCachedData(
      'sponsors',
      () => this.buildRequest<Sponsor[]>(
        '/api/sponsors',
        { populate: '*', 'filters[active][$eq]': true }
      )
    );
  }

  /**
   * Create donation record in Strapi (for admin access)
   */
  public createDonation(donation: Partial<Donation>): Observable<Donation> {
    return this.http.post<StrapiResponse<Donation>>(
      `${this.apiUrl}/api/donations`,
      { data: donation },
      { headers: this.getHeaders() }
    ).pipe(
      map(response => Array.isArray(response.data) ? response.data[0] : response.data),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get donations (admin only)
   */
  public getDonations(
    filters?: Record<string, unknown>,
    limit: number = 100
  ): Observable<Donation[]> {
    return this.buildRequest<Donation[]>(
      '/api/donations',
      { populate: '*', limit, ...filters }
    );
  }

  /**
   * Update content (admin only)
   */
  public updateContent<T>(
    contentType: string,
    id: string,
    data: Partial<T>
  ): Observable<T> {
    return this.http.put<StrapiResponse<T>>(
      `${this.apiUrl}/api/${contentType}/${id}`,
      { data },
      { headers: this.getHeaders() }
    ).pipe(
      map(response => Array.isArray(response.data) ? response.data[0] : response.data),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Create content (admin only)
   */
  public createContent<T>(
    contentType: string,
    data: Partial<T>
  ): Observable<T> {
    return this.http.post<StrapiResponse<T>>(
      `${this.apiUrl}/api/${contentType}`,
      { data },
      { headers: this.getHeaders() }
    ).pipe(
      map(response => Array.isArray(response.data) ? response.data[0] : response.data),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Delete content (admin only)
   */
  public deleteContent(contentType: string, id: string): Observable<boolean> {
    return this.http.delete<void>(
      `${this.apiUrl}/api/${contentType}/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(() => true),
      catchError(error => this.handleError(error))
    );
  }

  // ========================================================================
  // PRIVATE HELPER METHODS
  // ========================================================================

  private buildRequest<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    options?: { usePreviewToken?: boolean; skipCache?: boolean }
  ): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    // Add cache busting parameter if skipCache is enabled
    if (options?.skipCache) {
      httpParams = httpParams.set('_t', Date.now().toString());
    }

    const headers = this.getHeaders({
      usePreviewToken: options?.usePreviewToken,
      skipCache: options?.skipCache
    });
    const baseUrl = this.apiUrl || this.publicUrl || '';
    const requestUrl = baseUrl ? `${baseUrl}${endpoint}` : endpoint;

    return this.http
      .get<StrapiResponse<unknown>>(requestUrl, { params: httpParams, headers })
      .pipe(
        // Apply timeout to prevent indefinite waiting
        timeout(this.requestTimeoutMs),
        map(response => this.normalizeResponse(response.data) as T),
        tap(() => {
          this.errors$.next(null);
        }),
        catchError(error => this.handleError(error)),
        // Only use shareReplay when caching is enabled
        options?.skipCache ? tap() : shareReplay(1)
      );
  }

  private buildFilters(filters?: Record<string, unknown>): Record<string, unknown> {
    const builtFilters: Record<string, unknown> = {};
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          builtFilters[`filters[${key}][$eq]`] = value;
        }
      });
    }

    return builtFilters;
  }

  private getHeaders(options?: { contentType?: string; usePreviewToken?: boolean; skipCache?: boolean }): Record<string, string> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    const token = options?.usePreviewToken ? this.previewToken : this.apiKey;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const contentType = options?.contentType ?? 'application/json';
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    // Add cache control headers to prevent browser caching when skipCache is true
    if (options?.skipCache) {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }

    return headers;
  }

  private fetchSingleType<T>(uid: string, populate: string | string[] = 'deep', skipCache = false): Observable<T> {
    const populateParam = this.buildPopulateParam(populate);

    if (skipCache) {
      // Force fresh data by skipping cache completely
      return this.buildRequest<T>(
        `/api/${uid}`,
        populateParam ? { populate: populateParam } : undefined,
        { skipCache: true }
      );
    }

    return this.getCachedData(
      `single-${uid}-${populateParam ?? 'none'}`,
      () =>
        this.buildRequest<T>(`/api/${uid}`, populateParam ? { populate: populateParam } : undefined)
    );
  }

  private buildPopulateParam(populate?: string | string[]): string | undefined {
    if (!populate) {
      return undefined;
    }
    return Array.isArray(populate) ? populate.join(',') : populate;
  }

  private normalizeResponse(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map(item => this.normalizeEntity(item));
    }
    return this.normalizeEntity(data);
  }

  private normalizeEntity(entity: unknown): unknown {
    if (Array.isArray(entity)) {
      return entity.map(item => this.normalizeEntity(item));
    }

    if (entity && typeof entity === 'object') {
      const record = entity as Record<string, unknown>;

      if ('attributes' in record) {
        const { id, attributes } = record as { id?: number; attributes?: Record<string, unknown> };
        return {
          id,
          ...(this.normalizeEntity(attributes ?? {}) as Record<string, unknown>)
        };
      }

      if ('data' in record && Object.keys(record).length === 1) {
        const dataValue = record['data'];
        if (Array.isArray(dataValue)) {
          return dataValue.map(item => this.normalizeEntity(item));
        }
        if (dataValue === null) {
          return null;
        }
        return this.normalizeEntity(dataValue as unknown);
      }

      const normalized: Record<string, unknown> = {};
      Object.entries(record).forEach(([key, value]) => {
        normalized[key] = this.normalizeEntity(value);
      });
      return normalized;
    }

    return entity;
  }

  private getCachedData<T>(
    cacheKey: string,
    dataFn: () => Observable<T>
  ): Observable<T> {
    if (!this.cacheEnabled) {
      return dataFn();
    }

    const now = Date.now();
    const cachedData = this.cacheMap.get(cacheKey);
    const cacheTime = this.cacheTimestamps.get(cacheKey) || 0;

    if (this.cacheEnabled && cachedData && now - cacheTime < this.cacheDurationMs) {
      return cachedData as Observable<T>;
    }

    const data$ = dataFn().pipe(
      tap(() => {
        if (this.cacheEnabled) {
          this.cacheTimestamps.set(cacheKey, Date.now());
        }
      }),
      shareReplay(1)
    );

    if (this.cacheEnabled) {
      this.cacheMap.set(cacheKey, data$);
    } else {
      this.cacheMap.delete(cacheKey);
      this.cacheTimestamps.delete(cacheKey);
    }

    return data$;
  }

  private handleError(error: unknown): Observable<never> {
    let errorMessage = 'An error occurred';
    let errorData: StrapiError | null = null;

    if (error instanceof HttpErrorResponse) {
      const baseUrl = this.apiUrl || this.publicUrl || 'Strapi';

      if (error.status === 0) {
        errorMessage = `No se pudo conectar con el CMS (${baseUrl}). Verifica que el servidor esté en ejecución.`;
        errorData = {
          data: null,
          error: {
            status: 0,
            name: 'NetworkError',
            message: errorMessage,
            details: {
              url: error.url ?? undefined,
              statusText: error.statusText ?? 'Connection refused'
            }
          }
        } satisfies StrapiError;
      } else {
        errorMessage = `CMS responded with status ${error.status}: ${error.statusText || 'Error de servidor'}`;
        errorData = {
          data: null,
          error: {
            status: error.status,
            name: 'HttpErrorResponse',
            message: errorMessage,
            details: {
              url: error.url ?? undefined,
              statusText: error.statusText ?? 'Unknown error'
            }
          }
        } satisfies StrapiError;
      }
    } else if (error instanceof Error && error.name === 'TimeoutError') {
      errorMessage = `CMS request timeout after ${this.requestTimeoutMs}ms - using fallback assets`;
      errorData = {
        data: null,
        error: {
          status: 408,
          name: 'TimeoutError',
          message: errorMessage
        }
      };
      console.warn('CMS Timeout:', errorMessage);
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorData = {
        data: null,
        error: {
          status: 500,
          name: 'Error',
          message: errorMessage
        }
      };
    } else if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>;
      if (err['error']) {
        const errorInfo = err['error'] as Record<string, unknown>;
        errorData = {
          data: null,
          error: {
            status: (errorInfo?.['status'] as number) ?? 500,
            name: (errorInfo?.['name'] as string) ?? 'Error',
            message: (errorInfo?.['message'] as string) ?? errorMessage,
            details: (errorInfo?.['details'] as Record<string, unknown>) ?? undefined
          }
        } satisfies StrapiError;
        errorMessage = errorData.error.message;
      }
    }

    if (errorData) {
      this.errors$.next(errorData);
    }

    console.error('Strapi Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Clear cache for specific key or all
   */
  public clearCache(key?: string): void {
    if (key) {
      this.cacheMap.delete(key);
      this.cacheTimestamps.delete(key);
    } else {
      this.cacheMap.clear();
      this.cacheTimestamps.clear();
    }
  }

  /**
   * Force refresh of global settings by clearing cache and refetching
   */
  public refreshGlobalSettings(): Observable<GlobalSettings> {
    this.clearCache('single-global-deep');
    return this.fetchSingleType<GlobalSettings>('global', 'deep', true);
  }

  /**
   * Force refresh of home page content by clearing cache and refetching
   */
  public refreshHomePage(): Observable<HomePageContent> {
    this.clearCache('single-home-page-deep');
    return this.fetchSingleType<HomePageContent>('home-page', 'deep', true);
  }

  /**
   * Force refresh of donations page content by clearing cache and refetching
   */
  public refreshDonationsPage(): Observable<DonationsPageContent> {
    this.clearCache('single-donations-page-deep');
    return this.fetchSingleType<DonationsPageContent>('donations-page', 'deep', true);
  }

  /**
   * Force refresh of organization info by clearing cache and refetching
   */
  public refreshOrganizationInfo(): Observable<OrganizationInfo> {
    this.clearCache('org-info');
    return this.buildRequest<OrganizationInfo>(
      '/api/organization-info',
      { populate: 'deep' },
      { skipCache: true }
    );
  }

  /**
   * Force refresh all single types
   */
  public refreshAllContent(): void {
    this.clearCache();
  }

  public buildMediaUrl(media?: MediaAsset | null): string | null {
    if (!media || !media.url) {
      return null;
    }

    if (media.url.startsWith('http')) {
      return media.url;
    }

    const baseUrl = this.publicUrl || this.apiUrl || '';
    return baseUrl ? `${baseUrl}${media.url}` : media.url;
  }
}
