import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface ContactMessage {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  createdAt: Date;
  status: 'new' | 'read' | 'replied';
}

const CONTACT_MESSAGES_COLLECTION = 'contactMessages';

export const contactService = {
  // Submit a new contact message
  async submitContactMessage(messageData: Omit<ContactMessage, 'createdAt' | 'status'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CONTACT_MESSAGES_COLLECTION), {
        ...messageData,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      
      console.log('Contact message submitted successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting contact message:', error);
      throw new Error('Failed to submit contact message. Please try again.');
    }
  },

  // Get all contact messages (for admin use)
  async getAllContactMessages(): Promise<ContactMessage[]> {
    try {
      const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
      const querySnapshot = await getDocs(
        query(
          collection(db, CONTACT_MESSAGES_COLLECTION),
          orderBy('createdAt', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as ContactMessage[];
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw new Error('Failed to fetch contact messages.');
    }
  },

  // Update message status (for admin use)
  async updateMessageStatus(messageId: string, status: 'new' | 'read' | 'replied'): Promise<void> {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, CONTACT_MESSAGES_COLLECTION, messageId), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      throw new Error('Failed to update message status.');
    }
  }
}; 