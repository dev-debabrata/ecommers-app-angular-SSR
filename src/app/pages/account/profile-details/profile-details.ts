
import { Component, input } from '@angular/core';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [],
  templateUrl: './profile-details.html',
  styleUrl: './profile-details.css',
})
export class ProfileDetails {
  user = input<User | null>();
}
