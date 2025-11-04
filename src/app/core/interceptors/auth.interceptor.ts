/**
 * Authentication Interceptor
 * Adds authentication tokens to all HTTP requests
 */

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip adding token to PayPal and external requests
    if (this.shouldSkipInterceptor(request)) {
      return next.handle(request);
    }

    // Get token from localStorage
    const authToken = localStorage.getItem(environment.auth.tokenKey);

    if (authToken) {
      // Clone request and add authorization header
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(request);
  }

  /**
   * Check if interceptor should be skipped for this request
   */
  private shouldSkipInterceptor(request: HttpRequest<unknown>): boolean {
    const skipUrls = [
      'paypal.com',
      'sandbox.paypal.com',
      'api.paypal.com'
    ];

    return skipUrls.some(url => request.url.includes(url));
  }
}
