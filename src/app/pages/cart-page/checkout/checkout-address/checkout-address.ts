import {
  Component,
  inject,
  input,
  output,
  signal,
  effect,
  computed,
  DestroyRef,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AddressUser, User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './checkout-address.html',
  styleUrl: './checkout-address.css',
})
export class CheckoutAddress {
  private userService = inject(UserService);
  private snackbar = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);

  user = input<User | null>();
  addressSelected = output<AddressUser>();

  userData = signal<User | null>(null);
  editingIndex = signal<number | null>(null);
  selectedAddress = signal<AddressUser | null>(null);
  showAll = signal(false);
  showAddressPopup = signal(false);

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

  constructor() {
    effect(() => {
      const u = this.user();
      if (!u?.uid) return;

      const userSub = this.userService.getUserById(u.uid).subscribe((user) => {
        this.userData.set(user);
      });
      this.destroyRef.onDestroy(() => {
        userSub.unsubscribe();
      });
    });
  }

  ngAfterViewInit() {}

  editAddress(addr: AddressUser) {
    this.newAddress.set({ ...addr });

    const user = this.userData();
    const realIndex =
      user?.addresses?.findIndex((a) =>
        a.id ? a.id === addr.id : a.address === addr.address && a.pinCode === addr.pinCode,
      ) ?? -1;

    this.editingIndex.set(realIndex !== -1 ? realIndex : null);
    this.showAddressPopup.set(true);
  }

  selectAddress(addr: AddressUser) {
    this.selectedAddress.set(addr);
    this.addressSelected.emit(addr);
  }

  visibleAddresses = computed(() => {
    const addresses = this.userData()?.addresses || [];

    if (this.showAll()) return addresses;

    return addresses.slice(0, 2);
  });

  toggleShowAll() {
    this.showAll.update((v) => !v);
  }

  openPopup() {
    const u = this.userData();

    this.newAddress.set({
      fullName: `${u?.firstName || ''} ${u?.lastName || ''}`.trim(),
      email: u?.email || '',
      phone: u?.phoneNumber?.[0] || '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pinCode: '',
    });
    this.editingIndex.set(null);
    this.showAddressPopup.set(true);
  }

  updateField(field: keyof AddressUser, value: string) {
    this.newAddress.update((a) => ({ ...a, [field]: value }));
  }

  saveAddress() {
    const u = this.userData();
    if (!u?.uid) return;

    const base = this.newAddress();

    if (
      !base.fullName ||
      !base.phone ||
      !base.address ||
      !base.city ||
      !base.state ||
      !base.pinCode
    ) {
      this.snackbar.error('Fill all required fields');
      return;
    }

    let addresses = [...(u.addresses || [])];

    if (this.editingIndex() !== null) {
      const index = this.editingIndex()!;

      addresses[index] = {
        ...addresses[index],
        ...base,
      };
    } else {
      const addr: any = {
        ...base,
        // id: isPlatformBrowser(this.platformId)
        //   ? crypto.randomUUID()
        //   : Math.random().toString(36).substring(2),
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };

      addresses = [addr, ...addresses];
    }

    addresses = addresses.sort((a: any, b: any) => b.createdAt - a.createdAt);

    this.userService.updateUserAddress(u.uid, { addresses }).subscribe({
      next: () => {
        this.userData.set({ ...u, addresses });

        const idx = this.editingIndex();

        if (idx !== null) {
          this.selectAddress(addresses[idx]);
        } else {
          this.selectAddress(addresses[0]);
        }

        this.snackbar.success(idx !== null ? 'Address updated' : 'Address added');

        this.editingIndex.set(null);
        this.showAddressPopup.set(false);
      },

      error: () => this.snackbar.error('Failed to save address'),
    });
  }
}
