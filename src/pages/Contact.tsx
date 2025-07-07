import { useState, useEffect } from 'react';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { contactService } from '../services/contactService';
import { workingHoursService } from '../services/workingHoursService';
import type { WorkingHoursSettings } from '../types/vehicle';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  captchaAnswer: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
    captchaAnswer: ''
  });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [workingHours, setWorkingHours] = useState<WorkingHoursSettings | null>(null);
  const [loadingHours, setLoadingHours] = useState(true);
  const [captchaNumbers, setCaptchaNumbers] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  });

  useEffect(() => {
    const loadWorkingHours = async () => {
      try {
        const hours = await workingHoursService.getWorkingHoursSettings();
        setWorkingHours(hours);
      } catch (error) {
        console.error('Error loading working hours:', error);
      } finally {
        setLoadingHours(false);
      }
    };

    loadWorkingHours();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation (optional if phone is provided)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional if email is provided)
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (formData.phone.trim() && !phoneRegex.test(formData.phone.replace(/[\s\-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // At least one contact method is required
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = 'Either email or phone number is required';
      newErrors.phone = 'Either email or phone number is required';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    // CAPTCHA validation
    if (!formData.captchaAnswer.trim()) {
      newErrors.captchaAnswer = 'Please answer the verification question';
    } else if (parseInt(formData.captchaAnswer) !== captchaNumbers.answer) {
      newErrors.captchaAnswer = 'Incorrect answer. Please try again.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const generateNewCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaNumbers({ num1, num2, answer: num1 + num2 });
    setFormData(prev => ({ ...prev, captchaAnswer: '' }));
    setErrors(prev => ({ ...prev, captchaAnswer: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit the contact message to Firebase
      const { name, email, phone, message } = formData;
      const messageData: {
        name: string;
        message: string;
        email?: string;
        phone?: string;
      } = {
        name,
        message
      };
      
      // Only include the provided contact method
      if (email.trim()) {
        messageData.email = email.trim();
      }
      if (phone.trim()) {
        messageData.phone = phone.trim();
      }
      
      await contactService.submitContactMessage(messageData);
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        captchaAnswer: ''
      });
      generateNewCaptcha();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrors({ message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. We'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our vehicles or need assistance? We're here to help! 
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 rounded-full p-3">
                  <Phone className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">(555) 123-4567</p>
                  <p className="text-sm text-gray-500">Monday - Friday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 rounded-full p-3">
                  <Mail className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">info@automax.com</p>
                  <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 rounded-full p-3">
                  <User className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Visit Us</h3>
                  <p className="text-gray-600">123 Auto Street</p>
                  <p className="text-gray-600">City, State 12345</p>
                  <p className="text-sm text-gray-500">Showroom open daily</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
              {loadingHours ? (
                <div className="space-y-2">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : workingHours ? (
                <div className="space-y-2 text-sm">
                  {workingHours.workingDays.map((day) => (
                    <div key={day.id} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {day.dayOfWeek === 'monday' && 'Monday'}
                        {day.dayOfWeek === 'tuesday' && 'Tuesday'}
                        {day.dayOfWeek === 'wednesday' && 'Wednesday'}
                        {day.dayOfWeek === 'thursday' && 'Thursday'}
                        {day.dayOfWeek === 'friday' && 'Friday'}
                        {day.dayOfWeek === 'saturday' && 'Saturday'}
                        {day.dayOfWeek === 'sunday' && 'Sunday'}
                      </span>
                      <span className="font-medium">
                        {day.isHoliday ? (
                          <span className="text-red-600">{day.holidayName || 'Closed'}</span>
                        ) : day.isOpen && day.openTime && day.closeTime ? (
                          `${day.openTime} - ${day.closeTime}`
                        ) : (
                          <span className="text-red-600">Closed</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  <p>Business hours not available</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Contact Method Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Please provide either an email address or phone number so we can get back to you.
                </p>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* CAPTCHA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Human Verification *
                </label>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-600 mb-3">
                    Please solve this simple math problem to verify you're human:
                  </p>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold">
                      {captchaNumbers.num1} + {captchaNumbers.num2} = ?
                    </span>
                    <button
                      type="button"
                      onClick={generateNewCaptcha}
                      className="text-blue-600 hover:text-blue-700 text-sm underline"
                    >
                      New question
                    </button>
                  </div>
                  <input
                    type="number"
                    value={formData.captchaAnswer}
                    onChange={(e) => handleInputChange('captchaAnswer', e.target.value)}
                    className={`mt-3 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.captchaAnswer ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your answer"
                  />
                  {errors.captchaAnswer && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.captchaAnswer}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 