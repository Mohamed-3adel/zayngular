import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CategoriesResponse } from '../../models/categories/categories.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);

  getAllCategories(): Observable<CategoriesResponse> {
    return this.httpClient.get<CategoriesResponse>(environment.base_url + 'categories').pipe(
      catchError(() => {
        // Mock data when API fails
        const mockResponse: CategoriesResponse = {
          results: 4,
          metadata: {
            currentPage: 1,
            numberOfPages: 1,
            limit: 10,
          },
          data: [
            {
              _id: '1',
              name: 'Electronics',
              slug: 'electronics',
              image: 'https://placehold.co/400x400?text=Electronics',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              _id: '2',
              name: 'Clothing',
              slug: 'clothing',
              image: 'https://placehold.co/400x400?text=Clothing',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              _id: '3',
              name: 'Home & Garden',
              slug: 'home-garden',
              image: 'https://placehold.co/400x400?text=Home+Garden',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              _id: '4',
              name: 'Sports',
              slug: 'sports',
              image: 'https://placehold.co/400x400?text=Sports',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        };
        return of(mockResponse).pipe(delay(500));
      }),
    );
  }
}
