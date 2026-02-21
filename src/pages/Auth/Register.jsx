import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Upload, Check, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveOrUpdateUser } from '../../utils/auth';
import AuthNavbar from '../../components/layout/AuthNavbar';

const PasswordRequirement = ({ met, text }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-slate-500" />}
    <span className={met ? 'text-emerald-300' : 'text-slate-400'}>{text}</span>
  </div>
);

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { createUser, updateUserProfile, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPasswordStrength({
        hasMinLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isPasswordStrong) {
      setError('Please ensure your password meets all requirements');
      return;
    }

    try {
      setLoading(true);

      let photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&size=150&background=2563eb&color=fff`;
      if (formData.image) {
        const imageData = new FormData();
        imageData.append('image', formData.image);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
          method: 'POST',
          body: imageData,
        });

        const result = await response.json();
        if (result.data) {
          photoURL = result.data.display_url;
        }
      }

      const result = await createUser(formData.email, formData.password);
      await updateUserProfile(formData.name, photoURL);

      await saveOrUpdateUser({
        name: formData.name,
        email: formData.email,
        image: photoURL,
        uid: result.user.uid,
      });

      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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

      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  return (
    <div className="min-h-screen bg-[#111621] text-slate-100">
      <AuthNavbar />
      <div className="flex min-h-screen w-full overflow-hidden pt-20">
        <section
          className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-cover bg-center bg-no-repeat p-12 lg:flex"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1400&h=1800&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>

          

          <div className="relative z-10 mb-10 max-w-lg">
            <div className="mb-8 h-1 w-12 rounded-full bg-primary"></div>
            <h2 className="font-display text-5xl leading-tight text-white">
              Build your personal library with premium doorstep delivery.
            </h2>
            <p className="mt-6 text-lg text-slate-300">Curated collections, seamless checkout, and reader-first experience.</p>
          </div>
        </section>

        <section className="relative flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-28">
          <div className="w-full max-w-md space-y-6">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-800/70 p-1">
              <Link
                to="/login"
                className="rounded px-4 py-2.5 text-center text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-primary shadow-sm"
              >
                Join BookNest
              </Link>
            </div>

            <div className="space-y-1 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-white">Create account</h1>
              <p className="text-slate-400">Set up your profile and start your reading journey.</p>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Profile picture</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-14 w-14 rounded-full border border-primary/60 object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                      <User className="h-6 w-6" />
                    </div>
                  )}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-primary hover:text-primary">
                    <Upload className="h-4 w-4" />
                    Upload
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Full name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-10 text-sm text-slate-100 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

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
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-10 text-sm text-slate-100 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-10 pr-10 text-sm text-slate-100 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-3 space-y-1 rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                    <PasswordRequirement met={passwordStrength.hasMinLength} text="At least 8 characters" />
                    <PasswordRequirement met={passwordStrength.hasUpperCase} text="One uppercase letter" />
                    <PasswordRequirement met={passwordStrength.hasLowerCase} text="One lowercase letter" />
                    <PasswordRequirement met={passwordStrength.hasNumber} text="One number" />
                    <PasswordRequirement met={passwordStrength.hasSpecialChar} text="One special character" />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-10 text-sm text-slate-100 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isPasswordStrong || formData.password !== formData.confirmPassword || loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <div className="relative flex items-center py-1">
              <div className="h-px flex-1 bg-slate-700"></div>
              <span className="mx-4 text-xs font-medium uppercase tracking-wider text-slate-500">or</span>
              <div className="h-px flex-1 bg-slate-700"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-60"
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

            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
