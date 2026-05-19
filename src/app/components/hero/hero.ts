import { Component, inject, PLATFORM_ID, DestroyRef, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  images = [
    '/banner/banner1.jpg',
    '/banner/banner2.jpg',
    '/banner/banner3.jpg',
    '/banner/banner4.jpg',
    '/banner/banner5.jpg',
    '/banner/banner6.jpg',
  ];

  currentIndex = signal(0);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const bannerSub = interval(2000).subscribe(() => {
      this.currentIndex.update((index) => (index + 1) % this.images.length);
    });
    this.destroyRef.onDestroy(() => {
      bannerSub.unsubscribe();
    });
  }
}
