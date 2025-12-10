/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (US format)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {object} Validation result with isValid and errors array
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate ISBN format (ISBN-10 or ISBN-13)
 * @param {string} isbn - The ISBN to validate
 * @returns {boolean} True if valid ISBN format
 */
export const isValidISBN = (isbn) => {
  if (!isbn) return false;
  
  const cleaned = isbn.replace(/[^0-9X]/gi, '');
  
  // ISBN-10
  if (cleaned.length === 10) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * (10 - i);
    }
    const lastChar = cleaned[9].toUpperCase();
    sum += lastChar === 'X' ? 10 : parseInt(lastChar);
    return sum % 11 === 0;
  }
  
  // ISBN-13
  if (cleaned.length === 13) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleaned[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(cleaned[12]);
  }
  
  return false;
};

/**
 * Validate price (must be positive number)
 * @param {number|string} price - The price to validate
 * @returns {boolean} True if valid price
 */
export const isValidPrice = (price) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice > 0;
};

/**
 * Validate ZIP code (US format)
 * @param {string} zipCode - The ZIP code to validate
 * @returns {boolean} True if valid ZIP code
 */
export const isValidZipCode = (zipCode) => {
  if (!zipCode) return false;
  
  // 5 digits or 5+4 format
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

/**
 * Validate required field
 * @param {any} value - The value to validate
 * @returns {boolean} True if not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate string length
 * @param {string} str - The string to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {boolean} True if length is within range
 */
export const isValidLength = (str, min = 0, max = Infinity) => {
  if (!str) return min === 0;
  return str.length >= min && str.length <= max;
};

/**
 * Validate date is in the future
 * @param {string|Date} date - The date to validate
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return false;
  
  return dateObj > new Date();
};

/**
 * Validate URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid URL format
 */
export const isValidURL = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - The HTML string to sanitize
 * @returns {string} Sanitized HTML string
 */
export const sanitizeHTML = (html) => {
  if (!html) return '';
  
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

/**
 * Validate form data
 * @param {object} data - Form data to validate
 * @param {object} rules - Validation rules
 * @returns {object} Validation result with isValid and errors object
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }
    
    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = 'Invalid email format';
      return;
    }
    
    if (fieldRules.phone && !isValidPhone(value)) {
      errors[field] = 'Invalid phone number';
      return;
    }
    
    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = `Minimum length is ${fieldRules.minLength}`;
      return;
    }
    
    if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
      errors[field] = `Maximum length is ${fieldRules.maxLength}`;
      return;
    }
    
    if (fieldRules.pattern && value && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || 'Invalid format';
      return;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
