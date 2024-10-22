import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../Services/auth/auth.service';

export const protectedGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLogin = authService.isAuthenticate();
  if (isLogin === 'true') {
    router.navigate(['/tasklist']);
    return false;
  } else {
    return true;
  }
};
