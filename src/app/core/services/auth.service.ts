/**
 * Authentication Service
 * Manages user authentication with Strapi backend
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  blocked: boolean;
}

export interface AuthResponse {
  jwt: string;
  user: AuthUser;
}

export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.strapi?.url ?? '';
  private readonly tokenKey = environment.auth.tokenKey;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check token validity on initialization
    this.checkTokenValidity();
  }

  /**
   * Login with email/username and password
   */
  login(credentials: LoginCredentials): Observable<AuthUser> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/api/auth/local`,
      credentials
    ).pipe(
      tap(response => {
        this.setSession(response);
      }),
      map(response => response.user),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(
          error?.error?.error?.message ?? 'Error al iniciar sesión'
        ));
      })
    );
  }

  /**
   * Logout user and clear session
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('auth_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/cuenta']);
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    // For Strapi, we'll check if the user exists and is not blocked
    // You might want to add a role check here based on your Strapi setup
    return user !== null && !user.blocked;
  }

  // ========================================================================
  // PRIVATE METHODS
  // ========================================================================

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResult.jwt);
    localStorage.setItem('auth_user', JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
    this.isAuthenticatedSubject.next(true);
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return token !== null && token !== '';
  }

  private getUserFromStorage(): AuthUser | null {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  private checkTokenValidity(): void {
    const token = this.getToken();
    if (token) {
      // You could add a token validation endpoint call here
      // For now, we'll just check if it exists
      this.isAuthenticatedSubject.next(true);
    }
  }
}
