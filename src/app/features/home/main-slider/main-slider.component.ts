import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-slider',
  imports: [CommonModule, CarouselModule],
  templateUrl: './main-slider.component.html',
  styleUrl: './main-slider.component.css',
})
export class MainSliderComponent implements OnInit {
  private readonly translateService = inject(TranslateService);
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe({
      next: (data) => {
        this.minSliderCustomOptions = {
          ...this.minSliderCustomOptions,
          rtl: data.lang === 'ar' ? true : false,
        };
      },
    });
  }

  minSliderCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false,
    rtl: this.translateService.getCurrentLang() === 'ar' ? true : false,
  };
}
