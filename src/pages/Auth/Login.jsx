import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveOrUpdateUser } from '../../utils/auth';

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
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section
          className="relative hidden overflow-hidden lg:block"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=1600&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl font-bold">BookNest</p>
            </div>
            <div className="max-w-md">
              <div className="mb-6 h-1 w-12 rounded-full bg-primary"></div>
              <p className="font-display text-5xl italic leading-tight">
                "A room without books is like a body without a soul."
              </p>
              <p className="mt-5 text-lg text-slate-200">Marcus Tullius Cicero</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Sign in to continue your reading journey.</p>
            </div>

            <div className="card p-7 sm:p-8">
              {error && (
                <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-400">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <Link to="#" className="text-xs font-semibold text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
                Continue with Google
              </button>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
