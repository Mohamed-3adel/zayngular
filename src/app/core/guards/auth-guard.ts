import { CanActivateFn, Router } from '@angular/router';
import { stored_keys } from '../constants/stored-keys';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const plat_id = inject(PLATFORM_ID);

  if (isPlatformBrowser(plat_id)) {
    const token = localStorage.getItem(stored_keys.userToken);

    if (token) {
      return true;
    } else {
      return router.createUrlTree(['/login']);
    }
  }

  return true;
};
