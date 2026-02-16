import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../../core/services/products/products.service';
import { Product } from '../../../core/models/products/product.interface';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-populer-products',
  imports: [CardComponent],
  templateUrl: './populer-products.component.html',
  styleUrl: './populer-products.component.css',
})
export class PopulerProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  productList: WritableSignal<Product[]> = signal<Product[]>([]);

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
