import { afterNextRender, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/auth/services/authentication/auth.service';
import { OrdersService } from './services/orders.service';
import { Order } from './models/order.model';
import { catchError, finalize, of } from 'rxjs';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-allorders',
  imports: [],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css',
})
export class AllordersComponent {
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  // Signals
  readonly orders = signal<Order[]>([]);
  readonly selectedOrder = signal<Order | null>(null);
  readonly loadingState = signal<LoadingState>('idle');
  readonly errorMessage = signal<string>('');

  // Computed values
  readonly isLoading = computed(() => this.loadingState() === 'loading');
  readonly hasError = computed(() => this.loadingState() === 'error');
  readonly hasOrders = computed(() => this.orders().length > 0);
  readonly isEmpty = computed(() => 
    this.loadingState() === 'success' && this.orders().length === 0
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.initializeData();
      });
    }
  }

  private initializeData(): void {
    const userId = this.authService.getUserId() || this.authService.getUserIdFromToken();

    if (!userId) {
      this.errorMessage.set('User ID not found. Please login.');
      this.loadingState.set('error');
      return;
    }

    this.loadUserOrders(userId);
  }

  loadUserOrders(userId: string): void {
    this.loadingState.set('loading');
    this.errorMessage.set('');

    this.ordersService.getUserOrders(userId).pipe(
      catchError((error) => {
        this.errorMessage.set(
          error?.error?.message || 'Error loading orders. Please try again.'
        );
        this.loadingState.set('error');
        return of([]);
      }),
      finalize(() => {
        if (this.loadingState() === 'loading') {
          this.loadingState.set('success');
        }
      })
    ).subscribe({
      next: (data) => {
        this.orders.set(data || []);
        this.loadingState.set('success');
      },
    });
  }

  getStatusClass(order: Order): string {
    if (order.isDelivered) return 'bg-green-100 text-green-800';
    if (order.isPaid) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  }

  getStatusText(order: Order): string {
    if (order.isDelivered) return 'Delivered';
    if (order.isPaid) return 'Paid';
    return 'Pending';
  }

  getPaymentMethodText(method: string): string {
    return method === 'cash' ? 'Cash on Delivery' : 'Online Payment';
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder.set(order);
  }

  closeModal(): void {
    this.selectedOrder.set(null);
  }

  getTotalItems(order: Order): number {
    return order.cartItems.reduce((total, item) => total + item.count, 0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  refreshOrders(): void {
    const userId = this.authService.getUserId() || this.authService.getUserIdFromToken();
    if (userId) {
      this.loadUserOrders(userId);
    }
  }
}
