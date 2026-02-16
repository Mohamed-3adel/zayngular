import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UserData, UserDataResponse } from '../../models/user/user-data.interface';
import { jwtDecode } from 'jwt-decode';
import { stored_keys } from '../../../constants/stored-keys';
import { UserDataToken } from '../../../constants/user-data-token.interface';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { WishlistService } from '../../../../core/services/wishlist/wishlist.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly wishlistService = inject(WishlistService);

  userDtaDecoded: UserDataToken | null = null;

  sendRegData(userdata: UserData): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(environment.base_url + 'auth/signup', userdata);
  }

  sendLoginData(userdata: UserData): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(environment.base_url + 'auth/signin', userdata);
  }

  forgotPasswords(email: string): Observable<any> {
    return this.httpClient.post<any>(environment.base_url + 'auth/forgotPasswords', {
      email: email,
    });
  }

  decodeUserToken(): void {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem(stored_keys.userToken)) {
      const token = localStorage.getItem(stored_keys.userToken)!;
      this.userDtaDecoded = jwtDecode<UserDataToken>(token);
    }
  }

  userLogOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(stored_keys.userToken);
      this.wishlistService.clearWishlistLocal();
    }
    this.router.navigate(['/login']);
  }

  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  getUserIdFromToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId || null;
    } catch (error) {
      return null;
    }
  }

  setUserId(userId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userId', userId);
    }
  }

  getUser(): any {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
