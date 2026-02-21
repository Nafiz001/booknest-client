import { useMemo, useState } from 'react';
import { Check, Crown, Rocket, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Sparkles,
    monthly: 9,
    yearly: 7,
    description: 'Great for casual readers who want curated monthly picks.',
    features: ['2 active deliveries', 'Standard support', 'Basic recommendations'],
  },
  {
    id: 'pro',
    name: 'Pro Reader',
    icon: Rocket,
    monthly: 19,
    yearly: 15,
    description: 'Balanced plan for regular readers and faster delivery.',
    features: ['6 active deliveries', 'Priority packaging', 'Advanced recommendations', 'No late fees'],
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite Library',
    icon: Crown,
    monthly: 39,
    yearly: 31,
    description: 'Premium plan with maximum flexibility and VIP support.',
    features: ['Unlimited deliveries', 'VIP support', 'Early access releases', 'Family sharing'],
  },
];

const Memberships = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState(() => localStorage.getItem('booknest_selected_plan') || '');

  const savingsLabel = useMemo(() => {
    return billingCycle === 'yearly' ? 'Save up to 20%' : 'Switch to yearly for savings';
  }, [billingCycle]);

  const handleChoosePlan = (planId) => {
    if (!user) {
      navigate('/register');
      return;
    }

    localStorage.setItem('booknest_selected_plan', planId);
    setSelectedPlanId(planId);
    toast.success('Membership preference saved');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 text-slate-900 dark:from-[#07122a] dark:via-[#081a3e] dark:to-[#07122a] dark:text-slate-100">
      <Toaster position="top-right" />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <section className="animate-fade-in rounded-2xl border border-slate-200 bg-white/90 p-8 dark:border-slate-800 dark:bg-slate-900/45 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Memberships</p>
          <h1 className="mt-3 font-display text-5xl font-bold text-slate-900 dark:text-white">Choose Your Reading Plan</h1>
          <p className="mt-4 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
            Select a membership that matches your reading volume. Plans keep the existing BookNest experience, with faster delivery priority and premium perks.
          </p>

          <div className="mt-6 inline-flex items-center rounded-xl border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-900/70">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                billingCycle === 'monthly' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                billingCycle === 'yearly' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Yearly
            </button>
          </div>
          <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">{savingsLabel}</p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isSelected = selectedPlanId === plan.id;
            const isPopular = Boolean(plan.popular);
            const price = billingCycle === 'monthly' ? plan.monthly : plan.yearly;
            const unit = billingCycle === 'monthly' ? '/mo' : '/mo (billed yearly)';

            return (
              <article
                key={plan.id}
                className={`animate-slide-up rounded-2xl border bg-white/90 p-6 shadow-sm dark:bg-slate-900/45 ${
                  isPopular
                    ? 'border-primary shadow-lg shadow-primary/15 dark:border-primary'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                {isPopular && (
                  <span className="mb-3 inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                    Most Popular
                  </span>
                )}

                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h2>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>

                <div className="mt-5 flex items-end gap-1">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">${price}</span>
                  <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">{unit}</span>
                </div>

                <ul className="mt-5 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleChoosePlan(plan.id)}
                  className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold ${
                    isSelected
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : isPopular
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600'
                  }`}
                >
                  {isSelected ? 'Selected Plan' : user ? 'Choose Plan' : 'Sign Up to Choose'}
                </button>
              </article>
            );
          })}
        </section>

        <section className="animate-slide-up animate-delay-150 mt-10 rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-100 via-slate-100 to-white p-6 text-center dark:border-slate-800 dark:from-[#0a1737] dark:to-[#0c214f]">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Need a custom plan for teams?</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            For schools, reading clubs, and organizations, we can provide custom delivery and seat bundles.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link to="/info/support" className="btn-primary">
              Contact Support
            </Link>
            <Link to={user ? '/dashboard' : '/register'} className="btn-secondary">
              {user ? 'Back to Dashboard' : 'Create Account'}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Memberships;
