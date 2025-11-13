import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StrapiService } from '@core/services/strapi.service';

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
  whatsapp: string;
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  private readonly strapiService = inject(StrapiService);

  loading = false;
  submitted = false;
  error: string | null = null;

  contactInfo: ContactInfo = {
    phone: '+57 321 523 0283',
    email: 'contacto@facopec.org',
    address: 'Puerto Tejada, Valle del Cauca, Colombia',
    hours: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
    whatsapp: 'https://wa.me/573215230283'
  };

  contactForm: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  ngOnInit(): void {
    // Cargar información de contacto desde Strapi si está disponible
    this.loadOrganizationInfo();
  }

  private loadOrganizationInfo(): void {
    // Si tienes un endpoint específico para info de contacto, úsalo aquí
    // Por ahora usamos valores por defecto
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.error = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.loading = true;
    this.error = null;

    // Aquí integrarías con tu backend o servicio de email
    // Por ahora simulamos el envío
    console.log('Formulario de contacto enviado:', this.contactForm);

    // Simular respuesta exitosa
    setTimeout(() => {
      this.submitted = true;
      this.loading = false;
      this.resetForm();
    }, 1000);
  }

  private isFormValid(): boolean {
    return !!(
      this.contactForm.name.trim() &&
      this.contactForm.email.trim() &&
      this.contactForm.message.trim()
    );
  }

  private resetForm(): void {
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }

  closeSuccessMessage(): void {
    this.submitted = false;
  }
}
