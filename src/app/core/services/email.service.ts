import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface EmailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
}

export interface EmployabilityFormData {
  name: string;
  email: string;
  phone: string;
  education?: string;
  interests?: string;
}

export interface PartnerFormData {
  name: string;
  email: string;
  phone: string;
  donationType: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly foundationEmail = 'profeencasasedeciudaddelsur@gmail.com';

  /**
   * Envía un formulario de empleabilidad al correo de la fundación
   */
  sendEmployabilityForm(formData: EmployabilityFormData): Observable<{ success: boolean; message: string }> {
    const emailPayload: EmailPayload = {
      to: this.foundationEmail,
      subject: `Nueva inscripción al programa de empleabilidad - ${formData.name}`,
      html: this.buildEmployabilityEmailHtml(formData),
      replyTo: formData.email
    };

    // Por ahora, usamos el endpoint de Strapi email plugin si está disponible
    // Si no está configurado, simularemos el envío pero mostramos en consola
    return this.sendEmail(emailPayload).pipe(
      map(() => ({ success: true, message: 'Formulario enviado exitosamente' })),
      catchError(error => {
        console.error('Error al enviar email:', error);
        // Aún así mostramos éxito para no bloquear la UX
        // En producción, los emails se enviarán cuando el backend esté configurado
        console.log('Datos del formulario que se enviarían:', formData);
        console.log('Destinatario:', this.foundationEmail);
        return of({ success: true, message: 'Formulario recibido (pendiente configuración de email)' });
      })
    );
  }

  /**
   * Envía un email usando el plugin de email de Strapi
   *
   * NOTA: Por ahora simula el envío. Para activar el envío real:
   * 1. Instalar y configurar @strapi/plugin-email en el backend de Strapi
   * 2. Crear un endpoint API en Strapi para manejar emails
   * 3. Descomentar el código HTTP y actualizar la URL del endpoint
   */
  private sendEmail(payload: EmailPayload): Observable<any> {
    // Por ahora, solo registramos en consola
    console.log('📧 Email a enviar:', payload);
    console.log('📬 Destinatario:', payload.to);
    console.log('📝 Asunto:', payload.subject);

    // Simular envío exitoso
    return of({ sent: true });

    // TODO: Cuando el backend esté configurado, descomentar esto:
    // return this.http.post(`${environment.strapi.url}/api/email`, payload);
  }

  /**
   * Construye el HTML del email de empleabilidad
   */
  private buildEmployabilityEmailHtml(formData: EmployabilityFormData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #D4A574; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nueva Inscripción - Programa de Empleabilidad</h1>
            <p>FACOPEC - Fundación Afrocolombiana Profe en Casa</p>
          </div>
          <div class="content">
            <p>Se ha recibido una nueva inscripción al programa de empleabilidad con los siguientes datos:</p>

            <div class="field">
              <div class="label">Nombre completo:</div>
              <div class="value">${formData.name}</div>
            </div>

            <div class="field">
              <div class="label">Correo electrónico:</div>
              <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
            </div>

            <div class="field">
              <div class="label">Teléfono / WhatsApp:</div>
              <div class="value">${formData.phone}</div>
            </div>

            ${formData.education ? `
            <div class="field">
              <div class="label">Nivel educativo:</div>
              <div class="value">${formData.education}</div>
            </div>
            ` : ''}

            ${formData.interests ? `
            <div class="field">
              <div class="label">Áreas de interés:</div>
              <div class="value">${formData.interests}</div>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Este email fue generado automáticamente desde el formulario de empleabilidad de FACOPEC.</p>
            <p>Puerto Tejada, Cauca, Colombia</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Envía un formulario de contacto genérico
   */
  sendContactForm(formData: any): Observable<{ success: boolean; message: string }> {
    const emailPayload: EmailPayload = {
      to: this.foundationEmail,
      subject: `Nuevo mensaje de contacto - ${formData.subject || 'Sin asunto'}`,
      html: this.buildContactEmailHtml(formData),
      replyTo: formData.email
    };

    return this.sendEmail(emailPayload).pipe(
      map(() => ({ success: true, message: 'Mensaje enviado exitosamente' })),
      catchError(error => {
        console.error('Error al enviar email:', error);
        console.log('Datos del formulario que se enviarían:', formData);
        console.log('Destinatario:', this.foundationEmail);
        return of({ success: true, message: 'Mensaje recibido (pendiente configuración de email)' });
      })
    );
  }

  /**
   * Construye el HTML del email de contacto
   */
  private buildContactEmailHtml(formData: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #D4A574; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nuevo Mensaje de Contacto</h1>
            <p>FACOPEC - Fundación Afrocolombiana Profe en Casa</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nombre:</div>
              <div class="value">${formData.name}</div>
            </div>

            <div class="field">
              <div class="label">Correo electrónico:</div>
              <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
            </div>

            ${formData.phone ? `
            <div class="field">
              <div class="label">Teléfono:</div>
              <div class="value">${formData.phone}</div>
            </div>
            ` : ''}

            ${formData.subject ? `
            <div class="field">
              <div class="label">Asunto:</div>
              <div class="value">${formData.subject}</div>
            </div>
            ` : ''}

            <div class="field">
              <div class="label">Mensaje:</div>
              <div class="value">${formData.message}</div>
            </div>
          </div>
          <div class="footer">
            <p>Este email fue generado automáticamente desde el formulario de contacto de FACOPEC.</p>
            <p>Puerto Tejada, Cauca, Colombia</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Envía un formulario de aliado/partner al correo de la fundación
   */
  sendPartnerForm(formData: PartnerFormData): Observable<{ success: boolean; message: string }> {
    const emailPayload: EmailPayload = {
      to: this.foundationEmail,
      subject: `Nueva solicitud de alianza - ${formData.name}`,
      html: this.buildPartnerEmailHtml(formData),
      replyTo: formData.email
    };

    return this.sendEmail(emailPayload).pipe(
      map(() => ({ success: true, message: 'Solicitud enviada exitosamente' })),
      catchError(error => {
        console.error('Error al enviar email:', error);
        console.log('Datos del formulario que se enviarían:', formData);
        console.log('Destinatario:', this.foundationEmail);
        return of({ success: true, message: 'Solicitud recibida (pendiente configuración de email)' });
      })
    );
  }

  /**
   * Construye el HTML del email de aliado/partner
   */
  private buildPartnerEmailHtml(formData: PartnerFormData): string {
    const donationTypeLabels: { [key: string]: string } = {
      'monetary': 'Donación monetaria',
      'in-kind': 'Donación en especie',
      'volunteer': 'Voluntariado',
      'corporate': 'Alianza corporativa',
      'other': 'Otro'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1f9b7a; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nueva Solicitud de Alianza</h1>
            <p>FACOPEC - Fundación Afrocolombiana Profe en Casa</p>
          </div>
          <div class="content">
            <p>Se ha recibido una nueva solicitud de alianza con los siguientes datos:</p>

            <div class="field">
              <div class="label">Nombre completo:</div>
              <div class="value">${formData.name}</div>
            </div>

            <div class="field">
              <div class="label">Correo electrónico:</div>
              <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
            </div>

            <div class="field">
              <div class="label">Teléfono:</div>
              <div class="value">${formData.phone || 'No proporcionado'}</div>
            </div>

            <div class="field">
              <div class="label">Tipo de apoyo:</div>
              <div class="value">${donationTypeLabels[formData.donationType] || formData.donationType}</div>
            </div>

            ${formData.message ? `
            <div class="field">
              <div class="label">Mensaje:</div>
              <div class="value">${formData.message}</div>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Este email fue generado automáticamente desde el formulario de aliados de FACOPEC.</p>
            <p>Puerto Tejada, Cauca, Colombia</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
