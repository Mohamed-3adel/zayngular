import { Component, inject, Input, OnInit, Renderer2, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/auth/services/authentication/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly flowbiteService = inject(FlowbiteService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  @Input({ required: true }) isLogin!: boolean;

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  signOut(): void {
    this.authService.userLogOut();
  }

  get count(): number {
    return this.cartService.cartCount();
  }

  get wishlistCount$() {
    return this.wishlistService.wishlistCount;
  }

  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  // swich lan
  private readonly translateService = inject(TranslateService);
  private readonly renderer = inject(Renderer2);
  currentLang = signal<string>(this.translateService.getCurrentLang());
  isLangMenuOpen = signal<boolean>(false);

  toggleLangMenu() {
    this.isLangMenuOpen.update((value) => !value);
  }

  selectLanguage(lang: string): void {
    this.currentLang.set(lang);
    this.isLangMenuOpen.set(false);
    this.translateService.use(lang);

    this.renderer.setAttribute(document.documentElement, 'lang', lang);
    this.renderer.setAttribute(
      document.documentElement,
      'dir',
      lang === 'en' || lang === 'de' ? 'ltr' : 'rtl',
    );
  }
}
