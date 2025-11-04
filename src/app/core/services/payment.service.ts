/**
 * Payment Service
 * Handles PayPal and Women's Bank payment processing
 * Manages donation transactions and payment status tracking
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
  Donation,
  PaymentMethod,
  PaymentStatus,
  Currency,
  PayPalPaymentData,
  WomansBankPaymentData
} from '../models';
import { environment } from '@environments/environment';
import { StrapiService } from './strapi.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = environment.apiUrl;
  
  public paymentStatus$ = new BehaviorSubject<PaymentStatus | null>(null);
  public transactionData$ = new BehaviorSubject<Partial<Donation> | null>(null);

  constructor(
    private http: HttpClient,
    private strapiService: StrapiService
  ) {
    this.initializePayPalSDK();
  }

  /**
   * Initialize PayPal SDK
   */
  private initializePayPalSDK(): void {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypal.clientId}&currency=${environment.paypal.currency}`;
    script.async = true;
    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
    };
    document.body.appendChild(script);
  }

  /**
   * Create PayPal payment order
   */
  public createPayPalOrder(paymentData: PayPalPaymentData): Observable<{ id: string }> {
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: paymentData.currency,
            value: paymentData.amount.toString()
          },
          description: paymentData.description
        }
      ],
      payer: {
        email_address: paymentData.donorEmail,
        name: {
          given_name: paymentData.donorName.split(' ')[0],
          surname: paymentData.donorName.split(' ').slice(1).join(' ')
        }
      }
    };

    return this.http.post<{ id: string }>(
      `${this.apiUrl}/api/payments/paypal/create-order`,
      payload
    ).pipe(
      tap(response => {
        this.transactionData$.next({
          amount: paymentData.amount,
          currency: paymentData.currency,
          donorEmail: paymentData.donorEmail,
          donorName: paymentData.donorName,
          paymentMethod: 'paypal'
        });
      }),
      catchError(error => this.handlePaymentError(error))
    );
  }

  /**
   * Capture PayPal order and complete payment
   */
  public capturePayPalOrder(
    orderId: string,
    donationData: Partial<Donation>
  ): Observable<Donation> {
    return this.http.post<{ donation: Donation }>(
      `${this.apiUrl}/api/payments/paypal/capture-order`,
      { orderId }
    ).pipe(
      tap(response => {
        this.paymentStatus$.next('completed');
      }),
      map(response => {
        const donation = {
          ...donationData,
          ...response.donation,
          paymentStatus: 'completed' as PaymentStatus,
          paymentMethod: 'paypal' as PaymentMethod
        };
        return donation;
      }),
      tap(donation => {
        this.strapiService.createDonation(donation).subscribe(
          () => console.log('Donation recorded in Strapi'),
          error => console.error('Error recording donation:', error)
        );
      }),
      catchError(error => this.handlePaymentError(error))
    );
  }

  /**
   * Get Women's Bank payment details
   */
  public getWomansBankDetails(): Observable<WomansBankPaymentData> {
    return this.http.get<WomansBankPaymentData>(
      `${this.apiUrl}/api/payments/womans-bank/details`
    ).pipe(
      catchError(error => this.handlePaymentError(error))
    );
  }

  /**
   * Process manual Women's Bank transfer
   * Creates a pending donation record that can be verified later
   */
  public processBankTransferDonation(
    donationData: Omit<Donation, 'id' | 'paymentStatus' | 'timestamp'>
  ): Observable<Donation> {
    const donation: Partial<Donation> = {
      ...donationData,
      paymentMethod: 'womans-bank',
      paymentStatus: 'pending',
      timestamp: new Date(),
      transactionId: this.generateTransactionId()
    };

    this.paymentStatus$.next('pending');
    this.transactionData$.next(donation);

    return this.strapiService.createDonation(donation).pipe(
      tap(response => {
        console.log('Bank transfer donation recorded:', response);
      }),
      catchError(error => this.handlePaymentError(error))
    );
  }

  /**
   * Verify bank transfer payment (admin only)
   */
  public verifyBankTransfer(
    transactionId: string,
    proofDocument: File
  ): Observable<Donation> {
    const formData = new FormData();
    formData.append('transactionId', transactionId);
    formData.append('proofDocument', proofDocument);

    return this.http.post<Donation>(
      `${this.apiUrl}/api/payments/womans-bank/verify`,
      formData
    ).pipe(
      tap(() => {
        this.paymentStatus$.next('completed');
      }),
      catchError(error => this.handlePaymentError(error))
    );
  }

  /**
   * Get payment history for user
   */
  public getPaymentHistory(donorEmail: string): Observable<Donation[]> {
    return this.http.get<Donation[]>(
      `${this.apiUrl}/api/payments/history`,
      { params: { donorEmail } }
    ).pipe(
      catchError(error => this.handlePaymentError(error))
    );
  }

  /**
   * Get transaction receipt
   */
  public getReceipt(transactionId: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/api/payments/receipt/${transactionId}`,
      { responseType: 'blob' }
    ).pipe(
      catchError(error => this.handlePaymentError(error))
    );
  }

  /**
   * Check payment status
   */
  public checkPaymentStatus(transactionId: string): Observable<PaymentStatus> {
    return this.http.get<{ status: PaymentStatus }>(
      `${this.apiUrl}/api/payments/status/${transactionId}`
    ).pipe(
      map(response => response.status),
      tap(status => this.paymentStatus$.next(status)),
      catchError(error => this.handlePaymentError(error))
    );
  }

  /**
   * Refund payment (admin only)
   */
  public refundPayment(
    transactionId: string,
    reason: string
  ): Observable<{ refundId: string; status: PaymentStatus }> {
    return this.http.post<{ refundId: string; status: PaymentStatus }>(
      `${this.apiUrl}/api/payments/refund`,
      { transactionId, reason }
    ).pipe(
      tap(() => {
        this.paymentStatus$.next('refunded');
      }),
      catchError(error => this.handlePaymentError(error))
    );
  }

  /**
   * Validate donation amount
   */
  public validateDonationAmount(
    amount: number,
    currency: Currency
  ): { valid: boolean; message?: string } {
    const MIN_AMOUNT = 1;
    const MAX_AMOUNT = 100000;

    if (amount < MIN_AMOUNT) {
      return { valid: false, message: `Minimum donation is ${MIN_AMOUNT} ${currency}` };
    }

    if (amount > MAX_AMOUNT) {
      return { valid: false, message: `Maximum donation is ${MAX_AMOUNT} ${currency}` };
    }

    return { valid: true };
  }

  /**
   * Format currency for display
   */
  public formatCurrency(amount: number, currency: Currency): string {
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency
    });
    return formatter.format(amount);
  }

  // ========================================================================
  // PRIVATE HELPER METHODS
  // ========================================================================

  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private handlePaymentError(error: unknown): Observable<never> {
    let errorMessage = 'Payment processing failed';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>;
      errorMessage = (err['message'] as string) ?? errorMessage;
    }

    this.paymentStatus$.next('failed');
    console.error('Payment Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Reset payment state
   */
  public resetPaymentState(): void {
    this.paymentStatus$.next(null);
    this.transactionData$.next(null);
  }
}
