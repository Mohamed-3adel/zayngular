import { HttpInterceptorFn } from '@angular/common/http';
import { stored_keys } from '../../constants/stored-keys';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const plat_id = inject(PLATFORM_ID);

  if (isPlatformBrowser(plat_id)) {
    const token = localStorage.getItem(stored_keys.userToken);

    if (token) {
      if (req.url.includes('cart') || req.url.includes('orders') || req.url.includes('wishlist')) {
        req = req.clone({
          setHeaders: {
            token: token,
          },
        });
      }
    }
  }

  return next(req);
};
