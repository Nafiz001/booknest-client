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
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light py-12 dark:bg-background-dark">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/dashboard/my-orders')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Orders</span>
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="card lg:col-span-7">
            <div className="border-b border-slate-200 p-6 dark:border-slate-700">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <CreditCard className="h-4 w-4" />
                Secure Checkout
              </div>
              <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Complete Payment</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Secure checkout powered by Stripe</p>
            </div>
            {order && (
              <div className="p-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Payment Details
                  </h3>
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Item price</span>
                      <span>${Number(order.bookPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Shipping</span>
                      <span>$0.00</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 text-base font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                      <div className="flex items-center justify-between">
                        <span>Total due</span>
                        <span>${Number(order.bookPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-slate-700 dark:text-slate-300">
                  You will be redirected to Stripe&apos;s secure checkout page. This page never stores card data locally.
                </div>

                <button onClick={handlePayment} disabled={processing} className="btn-primary mt-6 w-full py-3 text-base">
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Proceed to Payment
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                  Test card: 4242 4242 4242 4242 | Any future expiry | Any 3-digit CVC
                </p>
              </div>
            )}
          </div>

          {order && (
            <aside className="card lg:col-span-5">
              <div className="border-b border-slate-200 p-5 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Order Summary</h2>
              </div>
              <div className="p-5">
                <div className="flex gap-4">
                  <img src={order.bookImage} alt={order.bookTitle} className="h-32 w-24 rounded object-cover shadow-md" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{order.bookTitle}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Order ID: {order._id}</p>
                    <p className="mt-3 text-3xl font-bold text-primary">${Number(order.bookPrice).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
