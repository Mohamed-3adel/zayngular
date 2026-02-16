export interface PaymentResponse {
  status: string;
  session: Payment;
}

export interface Payment {
  url: string;
  success_url: string;
  cancel_url: string;
}
