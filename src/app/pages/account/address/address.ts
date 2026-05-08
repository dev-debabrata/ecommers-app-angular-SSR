import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SnackbarService } from '../../../services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import { AddressUser, User } from '../../../models/user.model';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './address.html',
  styleUrl: './address.css',
})
export class Address {
  private userService = inject(UserService);
  private snackBar = inject(SnackbarService);

  user = input<User | null>();
  showAddressPopup = signal(false);
  editAddressIndex = signal<number | null>(null);

  newAddress = signal<AddressUser>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
  });

  updateField(field: keyof AddressUser, value: string) {
    this.newAddress.update((a) => ({
      ...a,
      [field]: value,
    }));
  }

  openAddressPopup() {
    const currentUser = this.user();
    if (!currentUser) return;

    this.newAddress.set({
      fullName: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
      phone: currentUser.phoneNumber?.[0] || '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pinCode: '',
    });

    this.editAddressIndex.set(null);
    this.showAddressPopup.set(true);
  }

  editAddress(index: number) {
    const currentUser = this.user();
    if (!currentUser || !currentUser.addresses) return;

    const addr = currentUser.addresses[index];
    this.newAddress.set({ ...addr });

    this.editAddressIndex.set(index);
    this.showAddressPopup.set(true);
  }

  saveAddress() {
    const addr = this.newAddress();
    const currentUser = this.user();

    if (!currentUser?.uid) return;

    if (
      !addr.fullName.trim() ||
      !addr.email.trim() ||
      !addr.phone.trim() ||
      !addr.address.trim() ||
      !addr.city.trim() ||
      !addr.state.trim() ||
      !addr.pinCode.trim()
    ) {
      this.snackBar.error('Please fill all required fields');
      return;
    }

    const addresses = [...(currentUser.addresses || [])];

    const cleanAddress: AddressUser = {
      fullName: addr.fullName.trim(),
      email: addr.email.trim(),
      phone: addr.phone.trim(),
      address: addr.address.trim(),
      landmark: addr.landmark?.trim() || '',
      city: addr.city.trim(),
      state: addr.state.trim(),
      pinCode: addr.pinCode.trim(),
    };

    if (this.editAddressIndex() !== null) {
      addresses[this.editAddressIndex()!] = cleanAddress;
    } else {
      addresses.unshift(cleanAddress);
    }

    this.userService.updateUserAddress(currentUser.uid, { addresses }).subscribe({
      next: () => {
        this.snackBar.success(
          this.editAddressIndex() !== null
            ? 'Address updated successfully'
            : 'Address saved successfully',
        );

        this.editAddressIndex.set(null);
        this.showAddressPopup.set(false);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.error('Failed to save address');
      },
    });
  }

  deleteAddress(index: number) {
    if (!confirm('Are you sure you want to delete this address?')) return;

    const currentUser = this.user();
    if (!currentUser?.uid) return;

    const addresses = [...(currentUser.addresses || [])];
    addresses.splice(index, 1);

    this.userService.deleteUserAddress(currentUser.uid, addresses).subscribe({
      next: () => {
        this.snackBar.success('Address deleted successfully');
      },
      error: () => {
        this.snackBar.error('Delete failed');
      },
    });
  }
}
