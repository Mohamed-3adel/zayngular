import { Component } from '@angular/core';
import { PopulerProductsComponent } from './populer-products/populer-products.component';
import { MainSliderComponent } from './main-slider/main-slider.component';
import { PopulerCategoriesComponent } from './populer-categories/populer-categories.component';

@Component({
  selector: 'app-home',
  imports: [PopulerProductsComponent, MainSliderComponent, PopulerCategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
