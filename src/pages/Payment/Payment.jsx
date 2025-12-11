import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchOrder = async () => {
    try {
      const userId = user?.id || user?._id;
      const response = await api.get(`/orders/user/${userId}`);
      const foundOrder = response.data.orders.find(o => o._id === orderId);
      
      if (!foundOrder) {
        toast.error('Order not found');
        navigate('/dashboard/my-orders');
        return;
      }

      if (foundOrder.paymentStatus === 'paid') {
        toast.info('This order has already been paid');
        navigate('/dashboard/my-orders');
        return;
      }

      setOrder(foundOrder);
    } catch (err) {
      console.error('Fetch order error:', err);
      toast.error('Failed to load order');
      navigate('/dashboard/my-orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please log in to continue with payment');
      navigate('/login');
      return;
    }

    setProcessing(true);
    try {
      const response = await api.post('/create-checkout-session', { order });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate('/dashboard/my-orders')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Orders</span>
        </button>

        <div className="card">
          <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-border-light dark:border-border-dark">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Payment</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Secure checkout powered by Stripe</p>
            </div>
          </div>

          {order && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Order Details
                </h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={order.bookImage}
                    alt={order.bookTitle}
                    className="w-20 h-28 object-cover rounded shadow-md"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                      {order.bookTitle}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Order ID: {order._id}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      ${Number(order.bookPrice).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> You will be redirected to Stripe's secure checkout page to complete your payment.
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Test card: 4242 4242 4242 4242 | Any future expiry | Any 3-digit CVC
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
