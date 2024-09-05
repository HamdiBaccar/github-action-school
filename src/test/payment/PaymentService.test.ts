import { PaymentDetails, PaymentMethod } from '../../app/payment/PaymentDetails';
import { PaymentService } from '../../app/payment/PaymentService';

describe('Payment Service', () => {
  const paymentAdapterMock = {
    processPayment: jest.fn(),
  };
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService(paymentAdapterMock);
  });

  test('should successfully process a valid payment', () => {
    // Arrange
    const paymentDetails : PaymentDetails = {amount: 999 , currency: 'EUR' , method: PaymentMethod.CreditCard , cardNumber:'9992221450'}
    const mockProcessPaymentResponse = {status: 'success' , transactionId: 'txn_123456789'}
    paymentAdapterMock.processPayment.mockImplementation((paymentDetails:PaymentDetails) =>mockProcessPaymentResponse)
    // Act
    const result = paymentService.makePayment(paymentDetails);
    // Assert
    expect(result).toEqual(`Payment successful. Transaction ID: ${mockProcessPaymentResponse.transactionId}`)
    expect(paymentAdapterMock.processPayment).toHaveBeenCalledWith(paymentDetails);
    // Check that processPayment inside makePayment has been called with paymentDetails
  });

  test('should throw an error for payment failure', () => {
    // Arrange
    const paymentDetails : PaymentDetails = {amount: 900 , currency: 'DT' , method: PaymentMethod.CreditCard , cardNumber:'9000221450'}
    const mockProcessPaymentResponse = {status: 'failure' , transactionId: 'txn_123456780'}
    paymentAdapterMock.processPayment.mockImplementation((paymentDetails:PaymentDetails) =>mockProcessPaymentResponse)
    // Act & Assert
    expect(() => paymentService.makePayment(paymentDetails)).toThrow('Payment failed');
  });

  test('should throw an error for invalid payment amount', () => {
    // Arrange
    const paymentDetails : PaymentDetails = {amount: -100 , currency: 'DT' , method: PaymentMethod.CreditCard , cardNumber:'9000221450'}
    // Act & Assert
    expect(() => paymentService.makePayment(paymentDetails)).toThrow('Invalid payment amount');
  });
});
