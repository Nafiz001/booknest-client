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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
      </div>

      <div className="max-w-2xl">
        <div className="card p-8">
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&size=150&background=2563eb&color=fff`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition-colors">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  className="input-field pl-10 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  className="input-field pl-10 opacity-60 cursor-not-allowed"
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
                    className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
