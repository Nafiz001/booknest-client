import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePayment = ({ amount, orderId, onSuccess, onCancel }) => {
  const options = {
    mode: 'payment',
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div className="stripe-payment-container">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm 
          amount={amount}
          orderId={orderId}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </Elements>
    </div>
  );
};

export default StripePayment;
