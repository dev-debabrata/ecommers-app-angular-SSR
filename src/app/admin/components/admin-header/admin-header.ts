import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AdminAuthService } from '../../../services/auth-admin.service';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader {
  private adminAuthService = inject(AdminAuthService);
  private firestore = inject(Firestore);
  private snacbar = inject(SnackbarService);

  adminName = 'Admin';

  // ngOnInit() {
  //   this.adminAuthService.firebaseUser$.subscribe(async (user) => {
  //     if (user) {
  //       const adminRef = doc(this.firestore, 'users/' + user.uid);
  //       const snap = await getDoc(adminRef);

  //       if (snap.exists()) {
  //         const data = snap.data();
  //         this.adminName = `${data['firstName']} ${data['lastName']}`;
  //       }
  //     }
  //   });
  // }

  ngOnInit() {
    this.adminAuthService.firebaseUser$.subscribe((user) => {
      // if (user?.displayName) {
      //   this.adminName = user.displayName;
      // }
      if (user) {
        this.adminName = user.displayName || user.email || 'Admin';
      }
    });
  }

  logout() {
    this.adminAuthService.logout();
    this.snacbar.success('Admin logout successfully!');
  }
}
