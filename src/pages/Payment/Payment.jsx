import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Loader2, Lock, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/shared/ThemeToggle';

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
      const foundOrder = response.data.orders.find((o) => o._id === orderId);

      if (!foundOrder) {
        toast.error('Order not found');
        navigate('/dashboard/my-orders');
        return;
      }

      if (foundOrder.paymentStatus === 'paid') {
        toast('This order has already been paid');
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
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, orderId]);

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
      } else {
        setProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-[#111621]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (!user || !order) return null;

  const totalDue = Number(order.bookPrice || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 text-slate-900 dark:from-[#111621] dark:via-[#0f1a33] dark:to-[#111621] dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-[#111621]/95">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
              <CreditCard className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">BookNest</h2>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <ThemeToggle className="h-9 px-2.5 sm:px-3" iconClassName="h-4 w-4" label={false} />
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row">
        <section className="flex-1 px-6 py-10 lg:px-20 lg:py-14">
          <div className="mx-auto max-w-xl">
            <button
              onClick={() => navigate('/dashboard/my-orders')}
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </button>

            <nav aria-label="Progress" className="mb-8">
              <ol className="flex items-center gap-4 text-sm font-medium">
                <li className="flex items-center gap-2 text-primary">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-primary/10 text-xs">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  Shipping
                </li>
                <li className="h-px w-8 bg-slate-300 dark:bg-slate-700"></li>
                <li className="flex items-center gap-2 text-primary">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</span>
                  Payment
                </li>
                <li className="h-px w-8 bg-slate-300 dark:bg-slate-700"></li>
                <li className="flex items-center gap-2 text-slate-500 dark:text-slate-500">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-xs dark:border-slate-700">3</span>
                  Confirmation
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Secure Payment</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Complete your purchase securely. All transactions are encrypted.</p>

            <div className="mt-8 space-y-4">
              <label className="block cursor-pointer rounded-lg border border-primary bg-primary/10 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">Credit Card</p>
                  </div>
                  <div className="flex gap-2 opacity-80">
                    <div className="h-5 w-8 rounded bg-gradient-to-br from-blue-800 to-blue-600"></div>
                    <div className="h-5 w-8 rounded bg-gradient-to-br from-red-600 to-orange-500"></div>
                  </div>
                </div>
              </label>

              <label className="block cursor-pointer rounded-lg border border-slate-300 bg-white p-4 transition-colors hover:border-primary/50 dark:border-slate-700 dark:bg-slate-800/70">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 dark:text-slate-300">PayPal</p>
                  </div>
                </div>
              </label>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Name on Card</label>
                <input
                  type="text"
                  placeholder={order.name || 'John Doe'}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 bg-white text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800" />
                Save this card for future purchases
              </label>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Pay ${totalDue}
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-500">
                Payments are processed securely by Stripe. Test card: 4242 4242 4242 4242
              </div>
            </div>
          </div>
        </section>

        <aside className="w-full border-t border-slate-200 bg-white/85 p-6 dark:border-slate-800 dark:bg-slate-900/40 lg:w-[480px] lg:min-h-[calc(100vh-73px)] lg:border-l lg:border-t-0 lg:p-10">
          <div className="sticky top-24">
            <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Order Summary</h2>
            <div className="mb-8 flex gap-4">
              <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-md shadow-xl">
                <img src={order.bookImage} alt={order.bookTitle} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-base font-bold text-slate-900 leading-tight dark:text-white">{order.bookTitle}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{order.name || user.displayName}</p>
                <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">${totalDue}</p>
                <p className="mt-1 text-xs text-slate-500">Order ID: {order._id}</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-white">${totalDue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Shipping (Premium)</span>
                <span className="font-medium text-slate-900 dark:text-white">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Taxes</span>
                <span className="font-medium text-slate-900 dark:text-white">$0.00</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
              <span className="text-base font-semibold text-slate-900 dark:text-white">Total due</span>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">${totalDue}</span>
            </div>

            <div className="mt-8 flex gap-3 rounded-lg border border-primary/20 bg-primary/10 p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">BookNest Guarantee</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Every book is inspected for quality. If you are not satisfied, return it within 30 days for a full refund.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Payment;
