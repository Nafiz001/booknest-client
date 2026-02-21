import { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    if (sessionId) {
      const processPayment = async () => {
        try {
          await api.post('/payment-success', { sessionId });
          setProcessing(false);
        } catch (error) {
          console.error('Payment processing error:', error);
          toast.error('Failed to process payment');
          navigate('/dashboard/my-orders');
        }
      };
      processPayment();
    } else {
      navigate('/dashboard/my-orders');
    }
  }, [sessionId, navigate]);

  if (processing) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="card relative max-w-2xl overflow-hidden p-10 text-center">
        <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-10"></div>
        <div className="relative">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/35">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Payment Successful!
          </h1>
          <p className="mx-auto mb-6 max-w-md text-slate-600 dark:text-slate-400">
            Thank you for your purchase. Your order is now confirmed and we&apos;ve started processing it for delivery.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/dashboard/my-orders" className="btn-primary px-7 py-3">
              Go to My Orders
            </Link>
            <Link to="/all-books" className="btn-outline px-7 py-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
