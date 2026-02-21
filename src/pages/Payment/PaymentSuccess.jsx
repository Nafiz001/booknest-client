import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Loader2, ShoppingCart, UserCircle2, PackageCheck } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import ThemeToggle from '../../components/shared/ThemeToggle';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [processing, setProcessing] = useState(true);
  const [receiptMeta] = useState(() => {
    const now = Date.now();
    return {
      orderNumber: `#BN-${String(now).slice(-4)}`,
      eta: new Date(now + 1000 * 60 * 60 * 24 * 3).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  });

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
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-[#111621]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-slate-500 dark:text-slate-400">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 text-slate-900 dark:from-[#111621] dark:via-[#0f1a33] dark:to-[#111621] dark:text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#1754cf 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-[#111621]/90">
        <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <PackageCheck className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">BookNest</h2>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle className="h-10 w-10 rounded-full border px-0" iconClassName="h-5 w-5" label={false} />
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <ShoppingCart className="h-5 w-5" />
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <UserCircle2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-[800px] space-y-10">
          <section className="flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl"></div>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30">
                <Check className="h-12 w-12" />
              </div>
            </div>

            <div className="max-w-[520px] space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">Order Confirmed!</h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Your literary journey begins soon. We have sent a confirmation email with your payment details.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/dashboard/my-orders"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-white shadow transition-transform hover:scale-105 hover:bg-primary-dark"
              >
                <PackageCheck className="h-4 w-4" />
                Track My Order
              </Link>
              <Link
                to="/all-books"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-8 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Continue Shopping
              </Link>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white/90 shadow-lg dark:border-slate-700 dark:bg-slate-800/55">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-6 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Order Number</p>
                <p className="font-mono text-lg font-medium text-slate-900 dark:text-white">{receiptMeta.orderNumber}</p>
              </div>
              <div className="sm:text-right">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Estimated Delivery</p>
                <p className="text-sm font-semibold text-primary">{receiptMeta.eta}</p>
              </div>
            </div>

            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-900/60">
              <div className="h-full w-1/4 rounded-r-full bg-primary"></div>
            </div>

            <div className="p-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Items in your order</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {[
                  {
                    title: 'The Great Gatsby',
                    author: 'F. Scott Fitzgerald',
                    price: '$14.50',
                    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=460&fit=crop',
                  },
                  {
                    title: '1984',
                    author: 'George Orwell',
                    price: '$12.00',
                    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=460&fit=crop',
                  },
                  {
                    title: 'Dune',
                    author: 'Frank Herbert',
                    price: '$18.99',
                    image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=300&h=460&fit=crop',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="h-24 w-16 shrink-0 overflow-hidden rounded bg-slate-700">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.author}</p>
                      <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-200">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/45">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">$45.49</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Shipping</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">$5.90</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Tax</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">$3.64</span>
                </div>
                <div className="my-2 h-px bg-slate-200 dark:bg-slate-700"></div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900 dark:text-white">Total Paid</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">$55.03</span>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center">
            <Link to="/dashboard/my-orders" className="text-sm text-slate-400 transition-colors hover:text-primary">
              Need help with this order?
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
