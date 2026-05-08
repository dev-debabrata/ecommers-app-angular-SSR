import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export class ContactPage {
  contact = {
    name: '',
    email: '',
    message: '',
  };

  submitted = false;

  submitForm() {
    console.log('Form Data:', this.contact);
    this.submitted = true;

    this.contact = { name: '', email: '', message: '' };
  }
}
