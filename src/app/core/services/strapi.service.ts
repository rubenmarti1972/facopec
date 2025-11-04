/**
 * Strapi CMS Integration Service
 * Manages all API communication with Strapi backend
 * Implements caching and error handling
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';
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
  OrganizationInfo
} from '../models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  private readonly apiUrl = environment.strapiUrl;
  private readonly apiKey = environment.strapiApiKey;
  
  // Cache management
  private cacheMap = new Map<string, Observable<unknown>>();
  private cacheTimestamps = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  // Error handling
  public errors$ = new BehaviorSubject<StrapiError | null>(null);

  constructor(private http: HttpClient) {}

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
      () => this.buildRequest<Project>(
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
    ) as Observable<Project>;
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
        return this.buildRequest<MediaItem>('/api/media-items', filters);
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

    return this.http.post<StrapiResponse<MediaItem>>(
      `${this.apiUrl}/api/upload`,
      formData,
      { headers: { 'Authorization': `Bearer ${this.apiKey}` } }
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
      () => this.buildRequest<Grant>(
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
    ) as Observable<Grant>;
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
    ) as Observable<LiteraryRoute>;
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
      () => this.buildRequest<NewsArticle>(
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
    return this.buildRequest<NewsArticle>(
      '/api/news-articles',
      {
        populate: '*',
        'filters[slug][$eq]': slug
      }
    ).pipe(
      map(articles => {
        if (Array.isArray(articles) && articles.length > 0) {
          return articles[0];
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
    ) as Observable<OrganizationInfo>;
  }

  /**
   * Get all sponsors
   */
  public getSponsors(): Observable<Sponsor[]> {
    return this.getCachedData(
      'sponsors',
      () => this.buildRequest<Sponsor>(
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
    return this.buildRequest<Donation>(
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
    params?: Record<string, unknown>
  ): Observable<T | T[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<StrapiResponse<T>>(
      `${this.apiUrl}${endpoint}`,
      { params: httpParams, headers: this.getHeaders() }
    ).pipe(
      map(response => response.data),
      tap(data => {
        if (!data) {
          this.errors$.next(null);
        }
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
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

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  private getCachedData<T>(
    cacheKey: string,
    dataFn: () => Observable<T>
  ): Observable<T> {
    const now = Date.now();
    const cachedData = this.cacheMap.get(cacheKey);
    const cacheTime = this.cacheTimestamps.get(cacheKey) || 0;

    if (cachedData && (now - cacheTime) < this.CACHE_DURATION) {
      return cachedData as Observable<T>;
    }

    const data$ = dataFn().pipe(
      tap(() => {
        this.cacheTimestamps.set(cacheKey, now);
      }),
      shareReplay(1)
    );

    this.cacheMap.set(cacheKey, data$);
    return data$;
  }

  private handleError(error: unknown): Observable<never> {
    let errorMessage = 'An error occurred';
    let errorData: StrapiError | null = null;

    if (error instanceof Error) {
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
        errorData = err as StrapiError;
        errorMessage = (err['error'] as Record<string, unknown>)['message'] as string ?? errorMessage;
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
}
