export type BillingType = "credit_card" | "pix" | "boleto";
export type PlanType = "basic" | "professional" | "business";
export type CycleType = "monthly" | "yearly";

export interface CreditCard {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface CreditCardHolderAddress {
  postalCode: string;
  number: string;
}

export interface CreditCardHolderInfo {
  name: string;
  email: string;
  cpfCnpj: string;
  address: CreditCardHolderAddress;
  phone: string;
  mobilePhone: string;
}

export interface CreateSubscriptionDTO {
  plan: PlanType;
  billingType: BillingType;
  cycle: CycleType;
  creditCard?: CreditCard;
  creditCardHolderInfo?: CreditCardHolderInfo;
  customerInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    phone?: string;
  };
}

export interface SubscriptionResponse {
  id: string;
  status: string;
  nextDueDate: string;
  value: number;
}

export interface PixPaymentResponse {
  id: string;
  status: string;
  value: number;
  qrCode: string; // QR Code em base64
  payload: string; // Código copia e cola do PIX
  expirationDate: string;
  paymentLink?: string;
}
