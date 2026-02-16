import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = environment.base_url;

  getUserOrders(userId: string): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.apiUrl}orders/user/${userId}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
