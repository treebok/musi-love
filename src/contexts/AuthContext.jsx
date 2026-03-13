import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Update last seen
  const updateLastSeen = async (uid) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        lastSeen: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last seen:', error);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists
      const profile = await fetchUserProfile(user.uid);
      
      if (!profile) {
        // Create new user profile
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          description: '',
          age: null,
          gender: null,
          lastSeen: serverTimestamp(),
          createdAt: serverTimestamp()
        });
      } else {
        // Update last seen
        await updateLastSeen(user.uid);
      }
      
      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    if (!currentUser) return;
    
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...updates,
        lastSeen: serverTimestamp()
      });
      
      // Refresh user profile
      const updatedProfile = await fetchUserProfile(currentUser.uid);
      setUserProfile(updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);
        
        // Update last seen when user is active
        await updateLastSeen(user.uid);
        
        // Update last seen every 5 minutes
        const intervalId = setInterval(() => {
          updateLastSeen(user.uid);
        }, 5 * 60 * 1000);
        
        setLoading(false);
        
        return () => clearInterval(intervalId);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signInWithGoogle,
    signOut,
    updateUserProfile,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
