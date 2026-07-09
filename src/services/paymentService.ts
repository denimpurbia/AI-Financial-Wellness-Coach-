/**
 * Payment Service
 * Handles all payment-related API calls
 */

export interface PaymentRequest {
  amount: string;
  category: string;
  purpose: string;
  payment_method: string;
  notes?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transaction: {
    id: string;
    user_id: string;
    amount: number;
    category: string;
    description: string;
    payment_method: string;
    date: string;
    created_at: string;
  };
  timestamp: string;
}

export interface PaymentSummary {
  total_amount: number;
  transaction_count: number;
  by_category: Record<string, number>;
  by_payment_method: Record<string, number>;
  average_transaction: number;
  currency: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  payment_method?: string;
  date: string;
  created_at: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class PaymentService {
  /**
   * Process a payment transaction
   */
  static async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          category: paymentData.category,
          purpose: paymentData.purpose,
          payment_method: paymentData.payment_method,
          notes: paymentData.notes || ''
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment processing failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  /**
   * Get all transactions for the user
   */
  static async getTransactions(
    limit: number = 50,
    offset: number = 0,
    category?: string
  ): Promise<{ success: boolean; transactions: Transaction[]; count: number }> {
    try {
      let url = `${API_BASE_URL}/payments/transactions?limit=${limit}&offset=${offset}`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * Get a specific transaction
   */
  static async getTransaction(transactionId: string): Promise<{ success: boolean; transaction: Transaction }> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Transaction not found');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  /**
   * Update a transaction
   */
  static async updateTransaction(
    transactionId: string,
    updateData: Partial<PaymentRequest>
  ): Promise<{ success: boolean; message: string; transaction: Transaction }> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  /**
   * Get payment summary/statistics
   */
  static async getPaymentSummary(): Promise<{ success: boolean; summary: PaymentSummary }> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/summary`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      throw error;
    }
  }

  /**
   * Get valid expense categories
   */
  static async getCategories(): Promise<{ categories: string[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get valid payment methods
   */
  static async getPaymentMethods(): Promise<{
    payment_methods: Array<{ id: string; label: string }>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/methods`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  /**
   * Get auth token from localStorage
   */
  private static getAuthToken(): string {
    // This assumes you're storing the auth token in localStorage
    // Adjust based on your actual authentication mechanism
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
    return token;
  }
}

export default PaymentService;
