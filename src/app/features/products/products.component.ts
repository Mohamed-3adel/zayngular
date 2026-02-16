import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Product } from '../../core/models/products/product.interface';
import { ProductsService } from '../../core/services/products/products.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { SearchPipe } from '../../shared/pipes/search-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CardComponent, NgxPaginationModule, SearchPipe, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  pagination: PaginationInstance = {
    id: 'products',
    itemsPerPage: 40,
    currentPage: 1,
    totalItems: 0,
  };
  term: string = '';

  productsList: WritableSignal<Product[]> = signal<Product[]>([]);

  ngOnInit(): void {
    this.getAllProducts();
  }
  getAllProducts(): void {
    this.productsService
      .getAllProducts(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (res) => {
          this.productsList.set(res.data);
          this.pagination.totalItems = res.results;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  pageChanged(page: number): void {
    this.pagination.currentPage = page;
    this.getAllProducts();
  }
}
