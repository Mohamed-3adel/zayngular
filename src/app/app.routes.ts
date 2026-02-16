import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/auth-layout/auth-layout.component').then((c) => c.AuthLayoutComponent),
    canActivate: [guestGuard],
    children: [
      {
        path: 'register',
        loadComponent: () =>
          import('./core/auth/register/register.component').then((c) => c.RegisterComponent),
        title: 'Register',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./core/auth/login/login.component').then((c) => c.LoginComponent),
        title: 'Login',
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import('./core/auth/forget-password/forget-password/forget-password.component').then(
            (c) => c.ForgetPasswordComponent,
          ),
        title: 'Forgot Password',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component').then((c) => c.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent),
        title: 'Home',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/products.component').then((c) => c.ProductsComponent),
        title: 'Products',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/categories.component').then((c) => c.CategoriesComponent),
        title: 'Categories',
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./features/brands/brands.component').then((c) => c.BrandsComponent),
        title: 'Brands',
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then((c) => c.CartComponent),
        title: 'Cart',
      },
      {
        path: 'checkout/:id',
        loadComponent: () =>
          import('./features/checkout/checkout.component').then((c) => c.CheckoutComponent),
        title: 'Checkout',
      },
      {
        path: 'allorders',
        loadComponent: () =>
          import('./features/allorders/allorders.component').then((c) => c.AllordersComponent),
        title: 'All Orders',
      },
      {
        path: 'details/:slug/:id',
        loadComponent: () =>
          import('./features/details/details.component').then((c) => c.DetailsComponent),
        title: 'Details',
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./features/wishlist/wishlist.component').then((c) => c.WishlistComponent),
        title: 'Wishlist',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/notfound/notfound.component').then((c) => c.NotfoundComponent),
    title: 'Error Page',
  },
];
