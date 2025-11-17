/**
 * Authentication Guard
 * Protects routes from unauthorized access
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login page
  router.navigate(['/cuenta'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // Redirect to login or home
  if (!authService.isAuthenticated()) {
    router.navigate(['/cuenta'], {
      queryParams: { returnUrl: state.url }
    });
  } else {
    router.navigate(['/inicio']);
  }

  return false;
};
