import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type MovementType = 'Ingreso' | 'Egreso';

interface FinancialRecord {
  id: number;
  type: MovementType;
  concept: string;
  amount: number;
  date: string;
  program: string;
  notes?: string;
}

interface AttendanceRecord {
  id: number;
  program: string;
  participants: number;
  date: string;
  notes?: string;
}

interface MonthlyFinancialSummary {
  key: string;
  label: string;
  ingresos: number;
  egresos: number;
  balance: number;
}

interface MonthlyAttendanceSummary {
  key: string;
  label: string;
  participantes: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  private nextFinancialId = 4;
  private nextAttendanceId = 4;

  readonly financialRecords: FinancialRecord[] = [
    {
      id: 1,
      type: 'Ingreso',
      concept: 'Donación corporativa',
      amount: 4500000,
      date: '2025-01-20',
      program: 'Tutorías Profe en Casa',
      notes: 'Convenio trimestral con empresa aliada'
    },
    {
      id: 2,
      type: 'Egreso',
      concept: 'Honorarios facilitadores',
      amount: 1800000,
      date: '2025-01-28',
      program: 'Ruta Literaria María'
    },
    {
      id: 3,
      type: 'Ingreso',
      concept: 'Campaña de donaciones en línea',
      amount: 1250000,
      date: '2025-02-05',
      program: 'Huerta y alimentación saludable'
    }
  ];

  readonly attendanceRecords: AttendanceRecord[] = [
    {
      id: 1,
      program: 'Tutorías Profe en Casa',
      participants: 42,
      date: '2025-01-31',
      notes: 'Sesiones virtuales y presenciales en Puerto Tejada'
    },
    {
      id: 2,
      program: 'Ruta Literaria María',
      participants: 27,
      date: '2025-01-28'
    },
    {
      id: 3,
      program: 'Huerta y alimentación saludable',
      participants: 18,
      date: '2025-02-15'
    }
  ];

  financialFormError: string | null = null;
  attendanceFormError: string | null = null;

  newFinancialRecord = {
    type: 'Ingreso' as MovementType,
    concept: '',
    amount: null as number | null,
    date: this.toInputDate(new Date()),
    program: '',
    notes: ''
  };

  newAttendanceRecord = {
    program: '',
    participants: null as number | null,
    date: this.toInputDate(new Date()),
    notes: ''
  };

  get totalIngresos(): number {
    return this.financialRecords
      .filter(record => record.type === 'Ingreso')
      .reduce((total, record) => total + record.amount, 0);
  }

  get totalEgresos(): number {
    return this.financialRecords
      .filter(record => record.type === 'Egreso')
      .reduce((total, record) => total + record.amount, 0);
  }

  get balanceGeneral(): number {
    return this.totalIngresos - this.totalEgresos;
  }

  get monthlyFinancialSummaries(): MonthlyFinancialSummary[] {
    const groups = new Map<string, { ingresos: number; egresos: number }>();

    for (const record of this.financialRecords) {
      const key = this.getMonthKey(record.date);
      const bucket = groups.get(key) ?? { ingresos: 0, egresos: 0 };

      if (record.type === 'Ingreso') {
        bucket.ingresos += record.amount;
      } else {
        bucket.egresos += record.amount;
      }

      groups.set(key, bucket);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => (a === b ? 0 : a > b ? -1 : 1))
      .map(([key, value]) => ({
        key,
        label: this.formatMonthLabel(key),
        ingresos: value.ingresos,
        egresos: value.egresos,
        balance: value.ingresos - value.egresos
      }));
  }

  get monthlyAttendanceSummaries(): MonthlyAttendanceSummary[] {
    const groups = new Map<string, number>();

    for (const record of this.attendanceRecords) {
      const key = this.getMonthKey(record.date);
      groups.set(key, (groups.get(key) ?? 0) + record.participants);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => (a === b ? 0 : a > b ? -1 : 1))
      .map(([key, total]) => ({ key, label: this.formatMonthLabel(key), participantes: total }));
  }

  get attendanceByProgram(): { program: string; participantes: number }[] {
    const groups = new Map<string, number>();

    for (const record of this.attendanceRecords) {
      groups.set(record.program, (groups.get(record.program) ?? 0) + record.participants);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([program, participantes]) => ({ program, participantes }));
  }

  addFinancialRecord(): void {
    this.financialFormError = null;
    const { type, concept, amount, date, program, notes } = this.newFinancialRecord;

    if (!concept.trim() || !amount || amount <= 0 || !date) {
      this.financialFormError = 'Completa todos los campos y verifica el monto registrado.';
      return;
    }

    const record: FinancialRecord = {
      id: this.nextFinancialId++,
      type,
      concept: concept.trim(),
      amount,
      date,
      program: program.trim() || 'General',
      notes: notes.trim() || undefined
    };

    this.financialRecords.unshift(record);

    this.newFinancialRecord = {
      type,
      concept: '',
      amount: null,
      date,
      program: '',
      notes: ''
    };
  }

  addAttendanceRecord(): void {
    this.attendanceFormError = null;
    const { program, participants, date, notes } = this.newAttendanceRecord;

    if (!program.trim() || !participants || participants <= 0 || !date) {
      this.attendanceFormError = 'Ingresa el programa, número de participantes y la fecha del reporte.';
      return;
    }

    const record: AttendanceRecord = {
      id: this.nextAttendanceId++,
      program: program.trim(),
      participants,
      date,
      notes: notes.trim() || undefined
    };

    this.attendanceRecords.unshift(record);

    this.newAttendanceRecord = {
      program: '',
      participants: null,
      date,
      notes: ''
    };
  }

  private toInputDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getMonthKey(date: string): string {
    const [year, month] = date.split('-');
    return `${year}-${month}`;
  }

  private formatMonthLabel(key: string): string {
    const [year, month] = key.split('-').map(part => Number(part));
    const localeDate = new Date(year, month - 1, 1);
    const label = localeDate.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
}
