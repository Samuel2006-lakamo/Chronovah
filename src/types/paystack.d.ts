// Type declarations for Paystack inline popup (loaded via CDN in index.html)
// API: const handler = window.PaystackPop.setup({...}); handler.openIframe();

interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  metadata?: Record<string, unknown>;
  channels?: string[];
  callback: (response: { reference: string; status: string; trans: string }) => void;
  onClose: () => void;
}

interface PaystackHandler {
  openIframe: () => void;
}

interface PaystackPopInterface {
  setup: (options: PaystackSetupOptions) => PaystackHandler;
}

interface Window {
  PaystackPop: PaystackPopInterface;
}
