import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Brand } from '../products/models/product-details/product-details.interface';
import { BrandsService } from './services/brands.service';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);

  brandsList: WritableSignal<Brand[]> = signal<Brand[]>([]);

  ngOnInit(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brandsList.set(res.data);
      },
      error: (err) => {},
    });
  }
}
