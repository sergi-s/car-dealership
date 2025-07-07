import { useState, useEffect } from 'react';
import { Star, User, Mail, Calendar, CheckCircle, Flag, MessageSquare, AlertTriangle } from 'lucide-react';
import { reviewService } from '../services/reviewService';
import type { Review } from '../types/vehicle';

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'flagged'>('all');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [reviewToFlag, setReviewToFlag] = useState<Review | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const allReviews = await reviewService.getAllReviews();
      setReviews(allReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      await reviewService.approveReview(reviewId);
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, isApproved: true, isFlagged: false, flagReason: undefined } : review
      ));
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleFlag = async () => {
    if (!reviewToFlag || !flagReason.trim()) return;

    try {
      await reviewService.flagReview(reviewToFlag.id!, flagReason.trim(), adminNotes.trim() || undefined);
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewToFlag.id 
          ? { ...review, isFlagged: true, flagReason: flagReason.trim(), adminNotes: adminNotes.trim() || undefined }
          : review
      ));
      setShowFlagModal(false);
      setFlagReason('');
      setAdminNotes('');
      setReviewToFlag(null);
    } catch (error) {
      console.error('Error flagging review:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      // Update local state
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      if (selectedReview?.id === reviewId) {
        setSelectedReview(null);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const openFlagModal = (review: Review) => {
    setReviewToFlag(review);
    setFlagReason('');
    setAdminNotes('');
    setShowFlagModal(true);
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !review.isApproved && !review.isFlagged;
    if (filter === 'approved') return review.isApproved;
    if (filter === 'flagged') return review.isFlagged;
    return true;
  });

  const getStatusBadge = (review: Review) => {
    if (review.isFlagged) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          Flagged
        </span>
      );
    }
    if (review.isApproved) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Approved
        </span>
      );
    }
    return (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
          </div>
          <p className="text-gray-600">
            Manage customer reviews, approve appropriate ones, and flag inappropriate content.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => !r.isApproved && !r.isFlagged).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.isApproved).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-full p-3">
                <Flag className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.isFlagged).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
              <div className="flex space-x-2">
                {(['all', 'pending', 'approved', 'flagged'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No reviews have been submitted yet.'
                  : `No ${filter} reviews found.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedReview?.id === review.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedReview(selectedReview?.id === review.id ? null : review)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {review.title}
                        </h3>
                        {getStatusBadge(review)}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{review.name}</span>
                        </div>
                        {review.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{review.email}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                    
                    <div className="ml-4 flex space-x-2">
                      {!review.isApproved && !review.isFlagged && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(review.id!);
                          }}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Approve
                        </button>
                      )}
                      {!review.isFlagged && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openFlagModal(review);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Flag
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(review.id!);
                        }}
                        className="text-gray-600 hover:text-red-600 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Review View */}
                  {selectedReview?.id === review.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Full Review</h4>
                        <p className="text-gray-700 mb-4">{review.comment}</p>
                        
                        {review.isFlagged && review.flagReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <h5 className="font-medium text-red-800 mb-1">Flag Reason:</h5>
                            <p className="text-red-700">{review.flagReason}</p>
                          </div>
                        )}
                        
                        {review.adminNotes && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h5 className="font-medium text-blue-800 mb-1">Admin Notes:</h5>
                            <p className="text-blue-700">{review.adminNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Flag Review</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for flagging *
                </label>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain why this review should be flagged..."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowFlagModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFlag}
                  disabled={!flagReason.trim()}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  Flag Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews; 