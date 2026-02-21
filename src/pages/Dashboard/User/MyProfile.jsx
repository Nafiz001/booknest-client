import { useState } from 'react';
import { User, Mail, Camera } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const MyProfile = () => {
  const { user, updateUserProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.photoURL);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    photoURL: user?.photoURL || ''
  });

  // Show loading spinner until user data with MongoDB ID is loaded
  if (loading || !user?._id && !user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      formData
    );
    
    return response.data.data.url;
  };

  const handleSubmit = async () => {
    if (!user?._id && !user?.id) {
      toast.error('User ID not found. Please try logging in again.');
      return;
    }
    
    try {
      setUploading(true);
      let photoURL = formData.photoURL;

      // If a new image was selected, upload it to ImgBB first
      if (selectedFile) {
        toast.loading('Uploading image...');
        photoURL = await uploadImageToImgBB(selectedFile);
        toast.dismiss();
      }

      // Update Firebase profile
      await updateUserProfile(formData.name, photoURL);
      
      // Sync with backend
      const userId = user._id || user.id;
      await api.patch(`/users/${userId}`, {
        name: formData.name,
        photoURL: photoURL
      });
      
      // Update local state
      setFormData({ ...formData, photoURL });
      setSelectedFile(null);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Account</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
      </div>

      <div className="max-w-3xl">
        <div className="card p-8">
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center rounded-xl bg-slate-50 p-6 dark:bg-slate-800/50">
              <div className="relative">
                <img
                  src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&size=150&background=2563eb&color=fff`}
                  alt="Profile"
                  className="h-28 w-28 rounded-full border-4 border-primary object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-2 text-white transition-colors hover:bg-primary-dark">
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Click camera icon to update your avatar</p>
            </div>

            {/* Name Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="input-field pl-10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field cursor-not-allowed pl-10 opacity-60"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Email cannot be changed
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    console.log('Edit Profile clicked');
                    setIsEditing(true);
                  }}
                  className="btn-primary px-6 py-2"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="btn-primary px-6 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.displayName || '',
                        photoURL: user?.photoURL || ''
                      });
                      setImagePreview(user?.photoURL);
                      setSelectedFile(null);
                    }}
                    disabled={uploading}
                    className="btn-secondary px-6 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
