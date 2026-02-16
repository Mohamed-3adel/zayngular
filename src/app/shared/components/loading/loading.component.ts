import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading/loading.service';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  template: `
    @if (loadingService.isLoading()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div class="bg-white rounded-lg p-6 shadow-xl flex items-center gap-4">
          <svg
            class="animate-spin h-8 w-8 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span class="text-gray-700 font-medium">Loading...</span>
        </div>
      </div>
    }
  `,
})
export class LoadingComponent {
  loadingService = inject(LoadingService);
}
