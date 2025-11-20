/**
 * Navigation Service
 * Manages navigation state and communication between components
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  // Subject para comunicar cuando se debe abrir el dropdown de programas
  private openProgramsDropdown$ = new Subject<void>();

  /**
   * Observable que emite cuando se debe abrir el dropdown de programas
   */
  get onOpenProgramsDropdown$() {
    return this.openProgramsDropdown$.asObservable();
  }

  /**
   * Solicitar la apertura del dropdown de programas en el header
   */
  openProgramsDropdown(): void {
    this.openProgramsDropdown$.next();
  }
}
