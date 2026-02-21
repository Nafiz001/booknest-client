import { useMemo, useState } from 'react';
import { Camera, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const MyProfile = () => {
  const { user, updateUserProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.photoURL);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    orderUpdates: true,
    promotions: false,
    weeklyDigest: true,
  });

  const [firstName, lastName] = useMemo(() => {
    const parts = (user?.displayName || '').trim().split(/\s+/).filter(Boolean);
    return [parts[0] || 'Alex', parts.slice(1).join(' ') || 'Reader'];
  }, [user?.displayName]);

  const [formData, setFormData] = useState({
    firstName,
    lastName,
    photoURL: user?.photoURL || '',
    street: '',
    city: '',
    region: '',
    postalCode: '',
  });

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgBB = async (file) => {
    const payload = new FormData();
    payload.append('image', file);
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      payload
    );
    return response.data.data.url;
  };

  const resetForm = () => {
    const nameParts = (user?.displayName || '').trim().split(/\s+/).filter(Boolean);
    setFormData({
      firstName: nameParts[0] || 'Alex',
      lastName: nameParts.slice(1).join(' ') || 'Reader',
      photoURL: user?.photoURL || '',
      street: '',
      city: '',
      region: '',
      postalCode: '',
    });
    setImagePreview(user?.photoURL);
    setSelectedFile(null);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    if (!user?._id && !user?.id) {
      toast.error('User ID not found. Please try logging in again.');
      return;
    }

    try {
      setUploading(true);
      let photoURL = formData.photoURL;

      if (selectedFile) {
        const uploadToast = toast.loading('Uploading image...');
        photoURL = await uploadImageToImgBB(selectedFile);
        toast.dismiss(uploadToast);
      }

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await updateUserProfile(fullName, photoURL);

      const userId = user._id || user.id;
      await api.patch(`/users/${userId}`, {
        name: fullName,
        photoURL: photoURL,
      });

      setFormData((prev) => ({ ...prev, photoURL }));
      setSelectedFile(null);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  const handleSecuritySave = async () => {
    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
      toast.error('Please complete all password fields');
      return;
    }

    if (securityForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    try {
      setSavingSecurity(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast.success('Password settings saved');
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } finally {
      setSavingSecurity(false);
    }
  };

  const handleNotificationSave = async () => {
    try {
      setSavingPrefs(true);
      await new Promise((resolve) => setTimeout(resolve, 650));
      toast.success('Notification preferences updated');
    } finally {
      setSavingPrefs(false);
    }
  };

  return (
    <div className="text-slate-900 dark:text-slate-100">
      <Toaster position="top-right" />

      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Dashboard</span>
          <span>{'>'}</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">Profile Settings</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your personal information and delivery preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex flex-col items-center text-center">
              <div className="group relative mb-4">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-slate-200 shadow-lg dark:border-slate-700">
                  <img
                    src={
                      imagePreview ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&size=150&background=2563eb&color=fff`
                    }
                    alt="Profile"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform hover:scale-110">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{`${formData.firstName} ${formData.lastName}`.trim()}</h2>
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">Member since 2023</p>
              <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
                Bibliophile Tier
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-primary to-blue-600 p-6 text-white shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-lg bg-white/20 p-2 backdrop-blur-sm text-xs font-semibold">PRO</span>
              <span className="rounded-full bg-white/15 px-2 py-1 text-xs font-medium">Auto-Renew On</span>
            </div>
            <h3 className="text-lg font-bold">Premium Subscription</h3>
            <p className="mt-1 text-sm text-blue-100">
              Your next billing date is <span className="font-semibold text-white">December 15, 2026</span>.
            </p>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs font-medium text-blue-100">
                <span>Usage</span>
                <span>8/10 Books</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/20">
                <div className="h-full w-[80%] rounded-full bg-white"></div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard/invoices')}
              className="mt-6 w-full rounded-lg bg-white/15 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              Manage Subscription
            </button>
          </div>
        </aside>

        <section className="animate-slide-up animate-delay-100 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
            <div className="border-b border-slate-200 px-6 dark:border-slate-700">
              <nav className="-mb-px flex gap-6">
                {[
                  { id: 'general', label: 'General Profile' },
                  { id: 'security', label: 'Password & Security' },
                  { id: 'notifications', label: 'Notifications' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`border-b-2 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {activeTab === 'general' && (
              <div className="space-y-8 p-6 md:p-8">
                <div>
                  <div className="mb-5 border-b border-slate-200 pb-2 dark:border-slate-700">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">Personal Information</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your connected profile details.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">First name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Last name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={!isEditing}
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 pl-10 pr-3 text-sm text-slate-500 opacity-80 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500">Contact support to change your email address.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-5 border-b border-slate-200 pb-2 dark:border-slate-700">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">Shipping Address</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Saved locally for UI preview.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                    <div className="col-span-full">
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Street address</label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        disabled={!isEditing}
                        placeholder="123 Library Lane, Apt 4B"
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Bookton"
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">State / Province</label>
                      <input
                        type="text"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        disabled={!isEditing}
                        placeholder="NY"
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">ZIP / Postal code</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        disabled={!isEditing}
                        placeholder="10001"
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <User className="h-4 w-4" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={uploading}
                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {uploading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 p-6 md:p-8">
                <div className="border-b border-slate-200 pb-2 dark:border-slate-700">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Password & Security</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Keep your account safe by updating your password regularly.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Current password</label>
                    <input
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">New password</label>
                    <input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Confirm new password</label>
                    <input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-200 pt-6 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleSecuritySave}
                    disabled={savingSecurity}
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingSecurity ? 'Saving...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 p-6 md:p-8">
                <div className="border-b border-slate-200 pb-2 dark:border-slate-700">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Choose which updates you want to receive from BookNest.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'orderUpdates', label: 'Order updates', help: 'Shipping, delivery, and status changes' },
                    { key: 'promotions', label: 'Promotions', help: 'Special campaigns and member offers' },
                    { key: 'weeklyDigest', label: 'Weekly digest', help: 'New arrivals and recommendations' },
                  ].map((pref) => (
                    <label
                      key={pref.key}
                      className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{pref.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{pref.help}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationPrefs[pref.key]}
                        onChange={(e) =>
                          setNotificationPrefs((prev) => ({ ...prev, [pref.key]: e.target.checked }))
                        }
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600"
                      />
                    </label>
                  ))}
                </div>

                <div className="flex justify-end border-t border-slate-200 pt-6 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleNotificationSave}
                    disabled={savingPrefs}
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingPrefs ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyProfile;
