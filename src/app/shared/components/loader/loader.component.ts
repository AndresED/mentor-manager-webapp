import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-[#0B0F19] bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <span class="text-white mt-4">Cargando...</span>
      </div>
    </div>
  `
})
export class LoaderComponent {} 