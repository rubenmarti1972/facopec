/**
 * Financial Accounting Service
 * Manages financial records, donations tracking, and reporting
 * Implements audit trail and data persistence
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
  FinancialRecord,
  FinancialSummary,
  Donation,
  FinancialType,
  FinancialCategory,
  RecordStatus
} from '../models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  private readonly apiUrl = environment.apiUrl;
  
  public financialSummary$ = new BehaviorSubject<FinancialSummary | null>(null);
  public recentTransactions$ = new BehaviorSubject<FinancialRecord[]>([]);

  constructor(private http: HttpClient) {
    this.initializeFinancialData();
  }

  /**
   * Initialize financial dashboard data
   */
  private initializeFinancialData(): void {
    this.getFinancialSummary().subscribe(
      summary => this.financialSummary$.next(summary),
      error => console.error('Error loading financial summary:', error)
    );

    this.getRecentRecords(20).subscribe(
      records => this.recentTransactions$.next(records),
      error => console.error('Error loading recent transactions:', error)
    );
  }

  /**
   * Get financial summary for period
   */
  public getFinancialSummary(
    startDate?: Date,
    endDate?: Date
  ): Observable<FinancialSummary> {
    const params: Record<string, string> = {};
    
    if (startDate) params['startDate'] = startDate.toISOString();
    if (endDate) params['endDate'] = endDate.toISOString();

    return this.http.get<FinancialSummary>(
      `${this.apiUrl}/api/financial/summary`,
      { params }
    ).pipe(
      tap(summary => this.financialSummary$.next(summary)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get all financial records with filters
   */
  public getFinancialRecords(
    filters?: {
      type?: FinancialType;
      category?: FinancialCategory;
      status?: RecordStatus;
      startDate?: Date;
      endDate?: Date;
    },
    limit: number = 100,
    offset: number = 0
  ): Observable<{ records: FinancialRecord[]; total: number }> {
    const params: Record<string, string> = {
      limit: limit.toString(),
      offset: offset.toString()
    };

    if (filters) {
      if (filters.type) params['type'] = filters.type;
      if (filters.category) params['category'] = filters.category;
      if (filters.status) params['status'] = filters.status;
      if (filters.startDate) params['startDate'] = filters.startDate.toISOString();
      if (filters.endDate) params['endDate'] = filters.endDate.toISOString();
    }

    return this.http.get<{ records: FinancialRecord[]; total: number }>(
      `${this.apiUrl}/api/financial/records`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get recent financial records
   */
  public getRecentRecords(limit: number = 20): Observable<FinancialRecord[]> {
    return this.http.get<FinancialRecord[]>(
      `${this.apiUrl}/api/financial/recent`,
      { params: { limit: limit.toString() } }
    ).pipe(
      tap(records => this.recentTransactions$.next(records)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Create financial record
   */
  public createRecord(
    record: Omit<FinancialRecord, 'id' | 'createdAt'>
  ): Observable<FinancialRecord> {
    return this.http.post<FinancialRecord>(
      `${this.apiUrl}/api/financial/records`,
      record
    ).pipe(
      tap(createdRecord => {
        const currentRecords = this.recentTransactions$.value;
        this.recentTransactions$.next([createdRecord, ...currentRecords]);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Update financial record
   */
  public updateRecord(
    id: string,
    updates: Partial<FinancialRecord>
  ): Observable<FinancialRecord> {
    return this.http.put<FinancialRecord>(
      `${this.apiUrl}/api/financial/records/${id}`,
      updates
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Approve financial record (requires authorization)
   */
  public approveRecord(id: string): Observable<FinancialRecord> {
    return this.http.patch<FinancialRecord>(
      `${this.apiUrl}/api/financial/records/${id}/approve`,
      { status: 'approved' }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Reject financial record with reason
   */
  public rejectRecord(id: string, reason: string): Observable<FinancialRecord> {
    return this.http.patch<FinancialRecord>(
      `${this.apiUrl}/api/financial/records/${id}/reject`,
      { status: 'rejected', notes: reason }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get donation statistics
   */
  public getDonationStats(
    startDate?: Date,
    endDate?: Date
  ): Observable<{
    totalDonations: number;
    averageDonation: number;
    medianDonation: number;
    largestDonation: number;
    donorCount: number;
    repeatDonors: number;
    topDonationCategories: { category: string; amount: number }[];
  }> {
    const params: Record<string, string> = {};
    if (startDate) params['startDate'] = startDate.toISOString();
    if (endDate) params['endDate'] = endDate.toISOString();

    return this.http.get<any>(
      `${this.apiUrl}/api/financial/donation-stats`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Export financial records as CSV
   */
  public exportRecordsAsCSV(filters?: Record<string, unknown>): Observable<Blob> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }

    return this.http.get(
      `${this.apiUrl}/api/financial/export/csv?${params.toString()}`,
      { responseType: 'blob' }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Export financial records as PDF
   */
  public exportRecordsAsPDF(filters?: Record<string, unknown>): Observable<Blob> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }

    return this.http.get(
      `${this.apiUrl}/api/financial/export/pdf?${params.toString()}`,
      { responseType: 'blob' }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Generate financial report
   */
  public generateReport(
    reportType: 'monthly' | 'quarterly' | 'annual',
    period: { year: number; month?: number; quarter?: number }
  ): Observable<{ report: string; generatedAt: Date }> {
    return this.http.post<{ report: string; generatedAt: Date }>(
      `${this.apiUrl}/api/financial/reports`,
      { reportType, period }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Record donation from payment transaction
   */
  public recordDonationTransaction(
    donation: Donation
  ): Observable<FinancialRecord> {
    const record: Omit<FinancialRecord, 'id' | 'createdAt'> = {
      type: 'donation',
      category: 'donation',
      amount: donation.amount,
      currency: donation.currency,
      description: `Donation: ${donation.donorName}`,
      relatedId: donation.id,
      status: donation.paymentStatus === 'completed' ? 'approved' : 'pending',
      notes: `Payment method: ${donation.paymentMethod}`
    };

    return this.createRecord(record);
  }

  /**
   * Get audit trail for record
   */
  public getAuditTrail(recordId: string): Observable<Array<{
    timestamp: Date;
    action: string;
    performedBy: string;
    changes?: Record<string, unknown>;
  }>> {
    return this.http.get<any>(
      `${this.apiUrl}/api/financial/records/${recordId}/audit-trail`
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Calculate budget utilization
   */
  public calculateBudgetUtilization(
    startDate: Date,
    endDate: Date,
    category?: FinancialCategory
  ): Observable<{
    budgeted: number;
    spent: number;
    remaining: number;
    utilizationPercentage: number;
    categoryBreakdown: Record<string, number>;
  }> {
    const params: Record<string, string> = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    
    if (category) params['category'] = category;

    return this.http.get<any>(
      `${this.apiUrl}/api/financial/budget-utilization`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Reconcile accounts
   */
  public reconcileAccounts(
    source: string,
    target: string,
    period: { startDate: Date; endDate: Date }
  ): Observable<{
    discrepancies: Array<{
      recordId: string;
      issue: string;
      amount: number;
    }>;
    reconciled: boolean;
  }> {
    return this.http.post<any>(
      `${this.apiUrl}/api/financial/reconcile`,
      {
        source,
        target,
        startDate: period.startDate.toISOString(),
        endDate: period.endDate.toISOString()
      }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ========================================================================
  // PRIVATE HELPER METHODS
  // ========================================================================

  private handleError(error: unknown): Observable<never> {
    let errorMessage = 'Financial operation failed';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Financial Service Error:', errorMessage);
    throw new Error(errorMessage);
  }
}
