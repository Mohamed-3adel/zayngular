import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet, FooterComponent, LoadingComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  private readonly _WishlistService = inject(WishlistService);

  ngOnInit(): void {
    this._WishlistService.getWishlist().subscribe();
  }
}
