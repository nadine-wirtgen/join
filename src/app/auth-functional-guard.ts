import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './firebase-service/auth.servic';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data && (route.data['requiredRole'] as string | undefined);

  if (authService.isLoggedIn()) {
    if (!requiredRole) {
      return true;
    }

    const userRole = (authService as any).getUserRole?.() as string | undefined;

    if (userRole && userRole === requiredRole) {
      return true;
    }
  }

  return router.createUrlTree(['/login']);
};
