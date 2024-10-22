import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../Services/auth/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLogin = authService.isAuthenticate();

  if (isLogin === 'true') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
