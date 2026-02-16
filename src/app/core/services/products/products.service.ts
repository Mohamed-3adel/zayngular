import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { ProductResponse } from '../../models/products/product.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);
  getAllProducts(page: number = 1, limit: number = 10): Observable<ProductResponse> {
    return this.httpClient
      .get<ProductResponse>(environment.base_url + `products?page=${page}&limit=${limit}`)
      .pipe(
        catchError(() => {
          const mockResponse: ProductResponse = {
            results: 6,
            metadata: {
              currentPage: 1,
              numberOfPages: 1,
              limit: 10,
              nextPage: 0,
            },
            data: [
              {
                _id: '1',
                title: 'iPhone 15 Pro',
                slug: 'iphone-15-pro',
                description: 'Latest Apple iPhone with A17 Pro chip',
                quantity: 50,
                price: 999,
                imageCover: 'https://placehold.co/400x400?text=iPhone',
                images: ['https://placehold.co/400x400?text=iPhone+1'],
                subcategory: [
                  { _id: '1', name: 'Smartphones', slug: 'smartphones', category: '1' },
                ],
                category: { _id: '1', name: 'Electronics', slug: 'electronics', image: '' },
                brand: { _id: '1', name: 'Apple', slug: 'apple', image: '' },
                ratingsAverage: 4.8,
                ratingsQuantity: 250,
                sold: 1000,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                id: '1',
              },
              {
                _id: '2',
                title: 'Samsung Galaxy S24',
                slug: 'samsung-galaxy-s24',
                description: 'Latest Samsung flagship phone',
                quantity: 45,
                price: 899,
                imageCover: 'https://placehold.co/400x400?text=Samsung',
                images: ['https://placehold.co/400x400?text=Samsung+1'],
                subcategory: [
                  { _id: '1', name: 'Smartphones', slug: 'smartphones', category: '1' },
                ],
                category: { _id: '1', name: 'Electronics', slug: 'electronics', image: '' },
                brand: { _id: '2', name: 'Samsung', slug: 'samsung', image: '' },
                ratingsAverage: 4.7,
                ratingsQuantity: 180,
                sold: 800,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                id: '2',
              },
              {
                _id: '3',
                title: 'MacBook Pro M3',
                slug: 'macbook-pro-m3',
                description: 'Apple MacBook Pro with M3 chip',
                quantity: 30,
                price: 1999,
                imageCover: 'https://placehold.co/400x400?text=MacBook',
                images: ['https://placehold.co/400x400?text=MacBook+1'],
                subcategory: [{ _id: '2', name: 'Laptops', slug: 'laptops', category: '1' }],
                category: { _id: '1', name: 'Electronics', slug: 'electronics', image: '' },
                brand: { _id: '1', name: 'Apple', slug: 'apple', image: '' },
                ratingsAverage: 4.9,
                ratingsQuantity: 320,
                sold: 500,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                id: '3',
              },
              {
                _id: '4',
                title: 'Nike Air Jordan',
                slug: 'nike-air-jordan',
                description: 'Classic basketball shoes',
                quantity: 100,
                price: 149,
                imageCover: 'https://placehold.co/400x400?text=Nike',
                images: ['https://placehold.co/400x400?text=Nike+1'],
                subcategory: [{ _id: '3', name: 'Shoes', slug: 'shoes', category: '4' }],
                category: { _id: '4', name: 'Sports', slug: 'sports', image: '' },
                brand: { _id: '3', name: 'Nike', slug: 'nike', image: '' },
                ratingsAverage: 4.6,
                ratingsQuantity: 500,
                sold: 2000,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                id: '4',
              },
              {
                _id: '5',
                title: "Levi's Denim Jacket",
                slug: 'levis-denim-jacket',
                description: 'Classic denim jacket for men',
                quantity: 80,
                price: 89,
                imageCover: 'https://placehold.co/400x400?text=Levis',
                images: ['https://placehold.co/400x400?text=Levis+1'],
                subcategory: [{ _id: '4', name: 'Jackets', slug: 'jackets', category: '2' }],
                category: { _id: '2', name: 'Clothing', slug: 'clothing', image: '' },
                brand: { _id: '4', name: "Levi's", slug: 'levis', image: '' },
                ratingsAverage: 4.5,
                ratingsQuantity: 200,
                sold: 600,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                id: '5',
              },
              {
                _id: '6',
                title: 'Home Security Camera',
                slug: 'home-security-camera',
                description: 'Smart security camera with night vision',
                quantity: 60,
                price: 79,
                imageCover: 'https://placehold.co/400x400?text=Camera',
                images: ['https://placehold.co/400x400?text=Camera+1'],
                subcategory: [{ _id: '5', name: 'Cameras', slug: 'cameras', category: '3' }],
                category: { _id: '3', name: 'Home & Garden', slug: 'home-garden', image: '' },
                brand: { _id: '5', name: 'Ring', slug: 'ring', image: '' },
                ratingsAverage: 4.4,
                ratingsQuantity: 150,
                sold: 400,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                id: '6',
              },
            ],
          };
          return of(mockResponse).pipe(delay(500));
        }),
      );
  }
}
