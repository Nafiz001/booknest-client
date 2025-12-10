import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { CreditCard, X } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CheckoutForm = ({ amount, orderId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  // Create payment intent when component mounts
  useState(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await api.post('/payment/create-intent', {
          amount,
          orderId
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        toast.error('Failed to initialize payment');
      }
    };
    createPaymentIntent();
  }, [amount, orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await api.post('/payment/confirm', {
          paymentIntentId: paymentIntent.id,
          orderId
        });

        toast.success('Payment successful!');
        onSuccess && onSuccess(paymentIntent);
      }
    } catch (error) {
      toast.error('Payment failed');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="card p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">Payment Details</h3>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
          <span className="text-2xl font-bold text-primary">${amount.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <PaymentElement />

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>🔒 Secured by Stripe</p>
      </div>
    </div>
  );
};

export default CheckoutForm;
