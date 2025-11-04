import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type DonationType = 'once' | 'monthly';

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonateComponent {
  // UI model
  donationAmounts = [
    { value: 20000, label: '$20.000', icon: '🎒', impact: 'Útiles para un niño' },
    { value: 50000, label: '$50.000', icon: '📚', impact: 'Libros y lectura guiada' },
    { value: 100000, label: '$100.000', icon: '🍎', impact: 'Refrigerios de un taller' },
    { value: 200000, label: '$200.000', icon: '🚌', impact: 'Transporte a actividades' },
  ];

  // Estado con señales
  readonly selectedAmount = signal<number>(0);
  readonly donationType = signal<DonationType>('once');

  // Monto personalizado (input con ngModel)
  customAmount: number | null = null;

  // Derivados (si los quieres usar en la plantilla)
  readonly isCustom = computed(() => this.customAmount != null && this.customAmount > 0);

  // Acciones
  selectAmount(value: number): void {
    this.selectedAmount.set(value);
    // limpiar campo personalizado si eligen uno predefinido
    this.customAmount = null;
  }

  onCustomAmountChange(): void {
    const v = Number(this.customAmount ?? 0);
    // fuerza mínimo 0 y quita NaN
    const safe = Number.isFinite(v) && v > 0 ? Math.floor(v) : 0;
    this.selectedAmount.set(safe);
  }

  getImpactMessage(): string {
    const amount = this.selectedAmount();
    const kind = this.donationType();

    // Texto base por tramos (ajústalo a tu realidad)
    let base: string;
    if (amount >= 200000) base = 'financia transporte y materiales para un grupo de niños';
    else if (amount >= 100000) base = 'cubre materiales y alimentación para un taller';
    else if (amount >= 50000) base = 'apoya libros y actividades de lectura';
    else if (amount >= 20000) base = 'aporta útiles para un estudiante';
    else base = 'apoya nuestras actividades';

    const suffix = kind === 'monthly'
      ? ' cada mes, creando impacto sostenido.'
      : ' en una jornada puntual.';

    return `Tu aporte de $${amount.toLocaleString('es-CO')} ${base}${suffix}`;
  }

  processDonation(): void {
    const payload = {
      amountCOP: this.selectedAmount(),
      type: this.donationType(),
      isCustom: this.isCustom(),
      ts: new Date().toISOString(),
    };
    // Aquí conectas con tu pasarela real (Wompi/PayPal/PSE/etc.)
    console.log('Donation payload →', payload);

    // Ejemplo: redirección o toast
    // this.router.navigate(['/gracias']);  // si usas Router
    // o muestra un modal/toast de éxito
    alert('¡Gracias por tu donación! Procesaremos el pago a continuación.');
  }
}

