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
          <p className="text-gray-600 dark:text-gray-400">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg text-center max-w-md w-full">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your purchase. Your order is being processed and will be delivered soon.
        </p>
        <Link
          to="/dashboard/my-orders"
          className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Go to My Orders
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
