import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../../services/loading/loading.service';
import { catchError, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  loading.show();

  return next(req).pipe(
    finalize(() => loading.hide()),
    catchError((error) => {
      loading.hide();
      throw error;
    }),
  );
};
