import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Upload, Check, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveOrUpdateUser } from '../../utils/auth';

const PasswordRequirement = ({ met, text }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? <Check className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-slate-400" />}
    <span className={met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}>{text}</span>
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
      setError('Passwords do not match!');
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
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 px-4 py-10 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <section className="hidden items-center rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-primary/90 p-10 text-white lg:flex">
          <div>
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl font-bold">BookNest</p>
            </div>
            <h2 className="font-display text-5xl font-bold leading-tight">Join a community built around serious reading.</h2>
            <p className="mt-4 max-w-md text-sm text-blue-100">
              Create your profile, track your deliveries, save favorites, and unlock personalized recommendations.
            </p>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Join BookNest and start reading today</p>
            </div>

            <form className="card space-y-5 p-7 sm:p-8" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-400">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Profile Picture</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-full border border-primary/40 object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                      <User className="h-7 w-7" />
                    </div>
                  )}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary">
                    <Upload className="h-4 w-4" />
                    Upload
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="input-field pl-10" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="input-field pl-10" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-3 space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                      <PasswordRequirement met={passwordStrength.hasMinLength} text="At least 8 characters" />
                      <PasswordRequirement met={passwordStrength.hasUpperCase} text="One uppercase letter" />
                      <PasswordRequirement met={passwordStrength.hasLowerCase} text="One lowercase letter" />
                      <PasswordRequirement met={passwordStrength.hasNumber} text="One number" />
                      <PasswordRequirement met={passwordStrength.hasSpecialChar} text="One special character" />
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isPasswordStrong || formData.password !== formData.confirmPassword || loading}
                className="btn-primary w-full py-3"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
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
                Sign up with Google
              </button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
