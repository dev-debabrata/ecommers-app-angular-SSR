import { Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth-user.service';
import { User } from '../../models/user.model';
import { Category } from '../../models/category.model';
import { CATEGORIES } from '../../data/category.data';
import { MENU } from '../../data/menu.data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, MatSnackBarModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  user = signal<User | null>(null);
  selectedCategory: Category | null = null;
  categories = CATEGORIES;
  menu = MENU;

  isSidebarOpen = false;
  isMenuOpen = false;
  isDropdownOpen = false;
  dropdownLeft = 0;
  dropdownTop = 0;

  get authReady() {
    return this.authService.isAuthReady();
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    // if (!isPlatformBrowser(this.platformId)) return;

    const sub = this.authService.getFullUser().subscribe({
      next: (user) => {
        this.user.set(user);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false;

    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });

    this.router.navigate(['/']);
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  openDropdown(category: Category, event: MouseEvent) {
    this.selectedCategory = category;
    this.isDropdownOpen = true;

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    this.dropdownLeft = rect.left;
    this.dropdownTop = rect.bottom;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  // goToSubCategory(sub: string) {
  //   this.router.navigate(['/products'], {
  //     queryParams: {
  //       main: this.selectedCategory!.name.toLowerCase().trim(),
  //       category: sub.toLowerCase().trim(),
  //     },
  //   });

  //   this.closeDropdown();
  // }

  goToMainCategory(cat: string) {
    this.router.navigate(['/products'], {
      queryParams: {
        main: cat.toLowerCase().trim(),
        category: 'all',
      },
    });

    this.closeDropdown();
  }

  goToSubCategory(sub: { label: string; slug: string }) {
    this.router.navigate(['/products'], {
      queryParams: {
        main: this.selectedCategory!.name.toLowerCase().trim(),
        category: sub.slug,
      },
    });

    this.closeDropdown();
  }
}
