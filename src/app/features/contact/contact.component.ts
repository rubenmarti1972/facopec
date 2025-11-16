import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '@core/services/email.service';

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
  private readonly emailService = inject(EmailService);

  loading = false;
  submitted = false;
  error: string | null = null;

  contactInfo: ContactInfo = {
    phone: '+57 321 523 0283',
    email: 'profeencasasedeciudaddelsur@gmail.com',
    address: 'Puerto Tejada, Cauca, Colombia',
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

    // Enviar el formulario usando el servicio de email
    this.emailService.sendContactForm(this.contactForm).subscribe({
      next: (response) => {
        console.log('Formulario enviado exitosamente:', response);
        console.log('Email enviado a: profeencasasedeciudaddelsur@gmail.com');

        this.submitted = true;
        this.loading = false;
        this.resetForm();

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.submitted = false;
        }, 5000);
      },
      error: (error) => {
        console.error('Error al enviar formulario:', error);
        this.error = 'Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.';
        this.loading = false;
      }
    });
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
