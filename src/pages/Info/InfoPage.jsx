import { Link, useParams } from 'react-router-dom';
import { FileText, ShieldCheck, BookOpen, ArrowLeft } from 'lucide-react';

const contentMap = {
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    description:
      'These terms outline platform usage, delivery timelines, and account responsibilities for BookNest members.',
  },
  privacy: {
    title: 'Privacy Policy',
    icon: ShieldCheck,
    description:
      'We only use your data for account operations, order processing, and service improvements within BookNest.',
  },
  cookies: {
    title: 'Cookie Policy',
    icon: ShieldCheck,
    description:
      'Cookies are used for secure sessions, preferences, and analytics that help us improve reading experiences.',
  },
  about: {
    title: 'About BookNest',
    icon: BookOpen,
    description:
      'BookNest is focused on premium book delivery, curated catalogs, and modern library experiences for readers.',
  },
  careers: {
    title: 'Careers',
    icon: BookOpen,
    description:
      'We hire product, design, and operations talent who care deeply about reading communities and customer experience.',
  },
  press: {
    title: 'Press',
    icon: FileText,
    description:
      'For media inquiries, partnerships, and brand assets, contact our press desk through support channels.',
  },
  sustainability: {
    title: 'Sustainability',
    icon: ShieldCheck,
    description:
      'BookNest prioritizes durable packaging, circular inventory reuse, and operational efficiency to reduce waste.',
  },
  'new-releases': {
    title: 'New Releases',
    icon: BookOpen,
    description:
      'Discover recently added titles from our premium catalog, refreshed regularly across major genres.',
  },
  'staff-picks': {
    title: 'Staff Picks',
    icon: BookOpen,
    description:
      'Editorially curated recommendations selected by our librarians and reading specialists.',
  },
  waitlist: {
    title: 'Waitlist Information',
    icon: FileText,
    description:
      'When a title is unavailable, we place it in your waitlist queue and notify you once stock returns.',
  },
  membership: {
    title: 'Membership Plans',
    icon: ShieldCheck,
    description:
      'Membership includes prioritized delivery, curated recommendations, and no-late-fee policies.',
  },
  gifts: {
    title: 'Gift Reading Plans',
    icon: BookOpen,
    description:
      'Gift plans let you share premium reading access with friends and family using scheduled deliveries.',
  },
  support: {
    title: 'Support',
    icon: FileText,
    description:
      'For password recovery, account changes, and order issues, contact support at support@booknest.com.',
  },
};

const InfoPage = () => {
  const { slug } = useParams();
  const content = contentMap[slug] || {
    title: 'Information',
    icon: FileText,
    description: 'This page shares product and policy information related to BookNest services.',
  };
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 dark:from-[#111621] dark:via-[#0f1a33] dark:to-[#111621]">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <article className="animate-fade-in rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-card dark:border-slate-700 dark:bg-slate-900/70">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{content.title}</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{content.description}</p>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Need help right now? Reach us at `support@booknest.com` and we will assist you.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="btn-primary">
              Back Home
            </Link>
            <Link to="/all-books" className="btn-secondary">
              Explore Catalog
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
};

export default InfoPage;
