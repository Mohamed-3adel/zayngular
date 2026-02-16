import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { Product } from '../../core/models/products/product.interface';

@Directive({
  selector: '[appPopup]',
  standalone: true
})
export class PopupDirective {
 
  @Input('appPopup') type: 'quickView' | 'addToCart' | 'imageZoom' | 'promo' = 'quickView';
  

  @Input() data: any;


  @Output() confirmed = new EventEmitter<any>();

  constructor() {}

  @HostListener('click')
  onClick(): void {
    switch (this.type) {
      case 'quickView':
        this.openQuickView();
        break;
      case 'addToCart':
        this.openAddToCartConfirmation();
        break;
      case 'imageZoom':
        this.openImageZoom();
        break;
      case 'promo':
        this.openPromoPopup();
        break;
    }
  }

  private openQuickView(): void {
    const product = this.data as Product;
    if (!product) return;

    Swal.fire({
      title: `<h2 class="text-2xl font-bold text-gray-800">${product.title}</h2>`,
      html: `
        <div class="flex flex-col md:flex-row gap-4 text-left">
          <div class="w-full md:w-1/2">
            <img src="${product.imageCover}" alt="${product.title}" class="w-full h-auto object-cover rounded-lg shadow-md mb-2">
            <div class="flex gap-2 overflow-x-auto">
               ${product.images ? product.images.slice(0, 3).map(img => `<img src="${img}" class="w-16 h-16 object-cover rounded border">`).join('') : ''}
            </div>
          </div>
          <div class="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <p class="text-gray-600 mb-4">${product.description ? product.description.substring(0, 150) + '...' : ''}</p>
              <div class="flex items-center gap-2 mb-2">
                 <span class="text-yellow-500 text-lg">★</span>
                 <span class="font-bold">${product.ratingsAverage}</span>
              </div>
              <div class="text-2xl font-bold text-green-600 mb-4">
                $${product.price}
              </div>
            </div>
            
            <!-- Note: Buttons in Swal HTML don't automatically bind to Angular methods. 
                 This is a visual representation. 
                 To make it functional, we rely on Swal preConfirm or custom event handling if needed. -->
            <div class="mt-4 p-2 bg-gray-50 rounded border text-sm text-gray-500">
               Category: ${product.category?.name} <br>
               Brand: ${product.brand?.name}
            </div>
          </div>
        </div>
      `,
      width: '800px',
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: '<i class="fa fa-shopping-cart"></i> Add to Cart',
      confirmButtonColor: '#10b981', // green-500
      showCancelButton: true,
      cancelButtonText: 'Close',
      focusConfirm: false,
      customClass: {
        container: 'z-50', // Ensure it's on top
        popup: 'rounded-xl overflow-hidden'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmed.emit(product);
        // Chain the success toast
        this.openAddToCartConfirmation();
      }
    });
  }

  private openAddToCartConfirmation(): void {
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: this.data?.title ? `${this.data.title} has been added to your cart.` : 'Item added successfully',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#ffffff',
      color: '#1f2937',
      iconColor: '#10b981'
    });
  }

  private openImageZoom(): void {
    const imageUrl = typeof this.data === 'string' ? this.data : this.data?.imageCover;
    
    if (!imageUrl) return;

    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: 'Product Zoom',
      width: 'auto',
      showConfirmButton: false,
      showCloseButton: true,
      background: 'transparent',
      backdrop: `
        rgba(0,0,0,0.8)
        left top
        no-repeat
      `,
      customClass: {
        popup: 'bg-transparent shadow-none',
        image: 'max-h-[90vh] rounded-lg shadow-2xl'
      }
    });
  }

  private openPromoPopup(): void {
    Swal.fire({
      title: this.data?.title || 'Special Offer!',
      text: this.data?.text || 'Get 50% off on all electronics this week.',
      imageUrl: this.data?.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
      confirmButtonText: 'Shop Now',
      confirmButtonColor: '#3b82f6',
      showCancelButton: true,
      cancelButtonText: 'Later',
      background: '#fff url(/images/trees.png)',
      backdrop: `
        rgba(0,0,123,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `
    }).then((result) => {
       if (result.isConfirmed) {
         this.confirmed.emit({ action: 'promo_click' });
       }
    });
  }
}
