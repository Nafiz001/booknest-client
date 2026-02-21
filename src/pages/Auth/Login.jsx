import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, BookOpen, Github } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveOrUpdateUser } from '../../utils/auth';
import AuthNavbar from '../../components/layout/AuthNavbar';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const result = await signIn(formData.email, formData.password);

      await saveOrUpdateUser({
        name: result.user?.displayName,
        email: result.user?.email,
        image: result.user?.photoURL,
        uid: result.user?.uid,
      });

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithGoogle();

      await saveOrUpdateUser({
        name: result.user?.displayName,
        email: result.user?.email,
        image: result.user?.photoURL,
        uid: result.user?.uid,
      });

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111621] text-slate-100">
      <AuthNavbar />
      <div className="flex min-h-screen w-full overflow-hidden pt-20">
        <section
          className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-cover bg-center bg-no-repeat p-12 lg:flex"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=1800&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>

          

          <div className="relative z-10 mb-10 max-w-lg">
            <div className="mb-8 h-1 w-12 rounded-full bg-primary"></div>
            <h2 className="font-display text-5xl italic leading-tight text-white">
              "A room without books is like a body without a soul."
            </h2>
            <p className="mt-6 text-lg text-slate-300">- Marcus Tullius Cicero</p>
          </div>
        </section>

        <section className="relative flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-28">
          <div className="w-full max-w-md space-y-7">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-800/70 p-1">
              <Link
                to="/login"
                className="rounded px-4 py-2.5 text-center text-sm font-medium text-primary shadow-sm bg-slate-900"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded px-4 py-2.5 text-center text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
              >
                Join BookNest
              </Link>
            </div>

            <div className="space-y-1 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
              <p className="text-slate-400">Enter your details to access your personal library.</p>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-60"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-500"
                title="GitHub auth is not configured for this app"
              >
                <Github className="h-4 w-4" />
                GitHub
              </button>
            </div>

            <div className="relative flex items-center py-1">
              <div className="h-px flex-1 bg-slate-700"></div>
              <span className="mx-4 text-xs font-medium uppercase tracking-wider text-slate-500">Or continue with</span>
              <div className="h-px flex-1 bg-slate-700"></div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-10 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <Link to="#" className="text-sm font-medium text-primary hover:text-blue-400">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-10 pr-10 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500">
              By clicking continue, you agree to our{' '}
              <Link to="#" className="font-medium text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="font-medium text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <p className="text-center text-xs text-slate-600">© {new Date().getFullYear()} BookNest Inc.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
