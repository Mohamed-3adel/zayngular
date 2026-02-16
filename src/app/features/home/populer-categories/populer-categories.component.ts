import { Component, inject, OnInit, signal, WritableSignal, PLATFORM_ID } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { Categories } from '../../../core/models/categories/categories.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-populer-categories',
  imports: [CarouselModule],
  templateUrl: './populer-categories.component.html',
  styleUrl: './populer-categories.component.css',
})
export class PopulerCategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly translateService = inject(TranslateService);

  private readonly platformId = inject(PLATFORM_ID);

  isBrowser = isPlatformBrowser(this.platformId);
  categoriesList: WritableSignal<Categories[]> = signal<Categories[]>([]);

  ngOnInit(): void {
    this.getAllCategoriesData();
    this.translateService.onLangChange.subscribe({
      next: (data) => {
        this.categoriesCustomOptions = {
          ...this.categoriesCustomOptions,
          rtl: data.lang === 'ar' ? true : false,
        };
      },
    });
  }
  getAllCategoriesData(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  categoriesCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: false,
    rtl: this.translateService.getCurrentLang() === 'ar' ? true : false,
  };
}
