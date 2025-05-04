// NewsletterForm.jsx
import { useState } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../firebase';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, 'newsletter'), {
        email,
        createdAt: serverTimestamp()
      });
      console.log('Newsletter subscribed:', email);
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    }
  };
  
  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Your email address" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      <button type="submit" className="btn-primary">Subscribe</button>
    </form>
  );
};

export default NewsletterForm;