import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private intervalId: any = null;

  images = [
    '/banner/banner1.jpg',
    '/banner/banner2.jpg',
    '/banner/banner3.jpg',
    '/banner/banner4.jpg',
    '/banner/banner5.jpg',
    '/banner/banner6.jpg',
  ];

  currentIndex = 0;

  ngOnInit() {
    //  Only run setInterval in browser
    if (!isPlatformBrowser(this.platformId)) return;

    this.intervalId = setInterval(() => {
      this.currentIndex++;
      if (this.currentIndex >= this.images.length) {
        this.currentIndex = 0;
      }
    }, 2000);
  }

  ngOnDestroy() {
    //  Always clear interval to prevent memory leaks
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-hero',
//   standalone: true,
//   imports: [],
//   templateUrl: './hero.html',
//   styleUrl: './hero.css',
// })
// export class Hero implements OnInit {
//   images = [
//     '/banner/banner1.jpg',
//     '/banner/banner2.jpg',
//     '/banner/banner3.jpg',
//     '/banner/banner4.jpg',
//     '/banner/banner5.jpg',
//     '/banner/banner6.jpg',
//   ];

//   currentIndex = 0;

//   ngOnInit() {
//     setInterval(() => {
//       this.currentIndex++;
//       if (this.currentIndex >= this.images.length) {
//         this.currentIndex = 0;
//       }
//     }, 2000);
//   }
// }

// import { interval, Subscription } from 'rxjs';

// private sub?: Subscription;

// ngOnInit() {
//   this.sub = interval(2000).subscribe(() => {
//     this.currentIndex = (this.currentIndex + 1) % this.images.length;
//   });
// }

// ngOnDestroy() {
//   this.sub?.unsubscribe();
// }
