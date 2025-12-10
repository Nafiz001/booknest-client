/**
 * Application-wide constants and configuration values
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication
export const TOKEN_KEY = 'booknest_token';
export const USER_KEY = 'booknest_user';
export const TOKEN_EXPIRY_DAYS = 7;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  LIBRARIAN: 'librarian',
  ADMIN: 'admin'
};

// Book Categories
export const BOOK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Horror',
  'Biography',
  'History',
  'Science',
  'Technology',
  'Business',
  'Self-Help',
  'Children',
  'Young Adult',
  'Poetry',
  'Drama',
  'Religion',
  'Philosophy',
  'Art',
  'Travel',
  'Cookbook',
  'Health',
  'Education'
];

// Book Status
export const BOOK_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

// Delivery Types
export const DELIVERY_TYPES = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup'
};

// Payment Status
export const PAYMENT_STATUS = {
  PAID: 'paid',
  UNPAID: 'unpaid',
  REFUNDED: 'refunded'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  CASH_ON_DELIVERY: 'cash_on_delivery'
};

// Authentication Providers
export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  GOOGLE: 'google'
};

// Image Upload
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'title_asc', label: 'Title (A-Z)' },
  { value: 'title_desc', label: 'Title (Z-A)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'date_desc', label: 'Newest First' },
  { value: 'date_asc', label: 'Oldest First' },
  { value: 'rating_desc', label: 'Highest Rated' }
];

// Toast Notification Duration
export const TOAST_DURATION = 3000; // 3 seconds

// Date Formats
export const DATE_FORMAT = 'MM/DD/YYYY';
export const DATETIME_FORMAT = 'MM/DD/YYYY hh:mm A';
export const TIME_FORMAT = 'hh:mm A';

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 2000,
  ISBN_LENGTH: [10, 13],
  PHONE_LENGTH: 10,
  ZIP_CODE_LENGTH: 5
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logout successful!',
  REGISTER: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  BOOK_ADDED: 'Book added successfully!',
  BOOK_UPDATED: 'Book updated successfully!',
  BOOK_DELETED: 'Book deleted successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully!',
  WISHLIST_ADDED: 'Added to wishlist!',
  WISHLIST_REMOVED: 'Removed from wishlist!'
};

// Feature Flags
export const FEATURES = {
  ENABLE_GOOGLE_AUTH: true,
  ENABLE_WISHLIST: true,
  ENABLE_REVIEWS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_PAYMENT_GATEWAY: false // Not implemented yet
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BOOKS: '/books',
  BOOK_DETAILS: '/books/:id',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  WISHLIST: '/dashboard/wishlist',
  MY_ORDERS: '/dashboard/my-orders',
  MY_BOOKS: '/dashboard/my-books',
  ADD_BOOK: '/dashboard/add-book',
  ORDERS: '/dashboard/orders',
  ALL_USERS: '/dashboard/all-users',
  MANAGE_BOOKS: '/dashboard/manage-books',
  REQUEST_DELIVERY: '/request-delivery',
  INVOICES: '/dashboard/invoices'
};

// Social Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/booknest',
  TWITTER: 'https://twitter.com/booknest',
  INSTAGRAM: 'https://instagram.com/booknest',
  LINKEDIN: 'https://linkedin.com/company/booknest'
};

// Contact Information
export const CONTACT_INFO = {
  EMAIL: 'support@booknest.com',
  PHONE: '(555) 123-4567',
  ADDRESS: '123 Library St, BookCity, BC 12345'
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  TOKEN_KEY,
  USER_KEY,
  TOKEN_EXPIRY_DAYS,
  USER_ROLES,
  BOOK_CATEGORIES,
  BOOK_STATUS,
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  DELIVERY_TYPES,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  AUTH_PROVIDERS,
  MAX_IMAGE_SIZE,
  ALLOWED_IMAGE_TYPES,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  SORT_OPTIONS,
  TOAST_DURATION,
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
  ROUTES,
  SOCIAL_LINKS,
  CONTACT_INFO
};
