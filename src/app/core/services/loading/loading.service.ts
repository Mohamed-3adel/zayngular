import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSignal = signal(false);

  isLoading = computed(() => this.loadingSignal());

  show() {
    this.loadingSignal.set(true);
  }

  hide() {
    this.loadingSignal.set(false);
  }
}
