import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { stored_keys } from './core/constants/stored-keys';
import { CartService } from './features/cart/services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('zayngular');
  private readonly cartService = inject(CartService);
  private readonly plat_id = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_id)) {
      const token = localStorage.getItem(stored_keys.userToken);
      if (token) {
        this.cartService.getUserCart().subscribe();
      }
    }
  }
}
