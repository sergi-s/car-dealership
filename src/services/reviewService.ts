import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Review } from '../types/vehicle';

const REVIEWS_COLLECTION = 'reviews';

export const reviewService = {
  // Submit a new review
  async submitReview(reviewData: Omit<Review, 'isApproved' | 'isFlagged' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
        ...reviewData,
        isApproved: false, // Reviews need admin approval by default
        isFlagged: false,
        createdAt: serverTimestamp()
      });
      
      console.log('Review submitted successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw new Error('Failed to submit review. Please try again.');
    }
  },

  // Get all approved reviews for public display
  async getApprovedReviews(): Promise<Review[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, REVIEWS_COLLECTION),
          where('isApproved', '==', true),
          orderBy('createdAt', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || undefined
      })) as Review[];
    } catch (error) {
      console.error('Error fetching approved reviews:', error);
      throw new Error('Failed to fetch reviews.');
    }
  },

  // Get all reviews for admin use
  async getAllReviews(): Promise<Review[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, REVIEWS_COLLECTION),
          orderBy('createdAt', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || undefined
      })) as Review[];
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      throw new Error('Failed to fetch reviews.');
    }
  },

  // Approve a review
  async approveReview(reviewId: string): Promise<void> {
    try {
      await updateDoc(doc(db, REVIEWS_COLLECTION, reviewId), {
        isApproved: true,
        isFlagged: false,
        flagReason: null,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error approving review:', error);
      throw new Error('Failed to approve review.');
    }
  },

  // Flag a review as inappropriate
  async flagReview(reviewId: string, reason: string, adminNotes?: string): Promise<void> {
    try {
      await updateDoc(doc(db, REVIEWS_COLLECTION, reviewId), {
        isFlagged: true,
        flagReason: reason,
        adminNotes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error flagging review:', error);
      throw new Error('Failed to flag review.');
    }
  },

  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, REVIEWS_COLLECTION, reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      throw new Error('Failed to delete review.');
    }
  },

  // Update admin notes
  async updateAdminNotes(reviewId: string, adminNotes: string): Promise<void> {
    try {
      await updateDoc(doc(db, REVIEWS_COLLECTION, reviewId), {
        adminNotes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating admin notes:', error);
      throw new Error('Failed to update admin notes.');
    }
  }
}; 