import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { stored_keys } from '../constants/stored-keys';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const plat_id = inject(PLATFORM_ID);

  if (isPlatformBrowser(plat_id)) {
    const token = localStorage.getItem(stored_keys.userToken);

    if (!token) {
      return true;
    } else {
      return router.createUrlTree(['/home']);
    }
  }

  return true;
};
