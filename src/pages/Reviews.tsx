import { useState, useEffect } from 'react';
import { Star, User, Mail, MessageSquare, Send, CheckCircle, AlertCircle, ThumbsUp } from 'lucide-react';
import { reviewService } from '../services/reviewService';
import type { Review } from '../types/vehicle';

interface ReviewForm {
  name: string;
  email: string;
  rating: number;
  title: string;
  comment: string;
  captchaAnswer: string;
}

interface ReviewFormErrors {
  name?: string;
  email?: string;
  rating?: string;
  title?: string;
  comment?: string;
  captchaAnswer?: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ReviewForm>({
    name: '',
    email: '',
    rating: 5,
    title: '',
    comment: '',
    captchaAnswer: ''
  });
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [captchaNumbers, setCaptchaNumbers] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const approvedReviews = await reviewService.getApprovedReviews();
      setReviews(approvedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ReviewFormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Rating validation
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a rating';
    }

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Review title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    // Comment validation
    if (!formData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
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

  const handleStringChange = (field: keyof ReviewForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    // Clear error when user starts typing
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
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
      const { name, email, rating, title, comment } = formData;
      await reviewService.submitReview({
        name: name.trim(),
        email: email.trim(),
        rating,
        title: title.trim(),
        comment: comment.trim()
      });
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        rating: 5,
        title: '',
        comment: '',
        captchaAnswer: ''
      });
      generateNewCaptcha();
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ comment: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your review! It will be reviewed by our team and published soon.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Submit Another Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Read what our customers have to say about their experience with AutoMax. 
            We value your feedback and strive to provide the best service possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ThumbsUp className="h-6 w-6 mr-2 text-yellow-600" />
                What Our Customers Say
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <ThumbsUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Be the first to share your experience with us!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 rounded-full p-2">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{review.name}</h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <span className="text-sm text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-11">
                        <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h2>
              
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
                      onChange={(e) => handleStringChange('name', e.target.value)}
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
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleStringChange('email', e.target.value)}
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

                {/* Rating Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.rating}
                    </p>
                  )}
                </div>

                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title *
                  </label>
                                      <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleStringChange('title', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Brief summary of your experience"
                    />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Comment Field */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      id="comment"
                      rows={4}
                      value={formData.comment}
                      onChange={(e) => handleStringChange('comment', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                        errors.comment ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Share your experience with us..."
                    />
                  </div>
                  {errors.comment && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.comment}
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
                      onChange={(e) => handleStringChange('captchaAnswer', e.target.value)}
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
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Review
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> All reviews are moderated before being published. 
                  We reserve the right to remove inappropriate content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews; 