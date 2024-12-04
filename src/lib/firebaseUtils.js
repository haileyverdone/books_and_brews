import { auth, db } from './firebaseConfig';
import { setPersistence, browserSessionPersistence, createUserWithEmailAndPassword, signInWithCustomToken, signOut, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Register a new user and send a verification email
export async function registerUser(email, password, name, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    // Store additional user information in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      username,
      email,
      createdAt: serverTimestamp(),
    });

    console.log('User registered and verification email sent.');
    return { success: true, user, message: 'Registration successful. Please check your email to verify your account.' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: error.message || 'Failed to register user' };
  }
}

// Login user and check email verification status
export async function loginUser(email, password) {
  try {
    const response = await fetch('api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to log in.');
    }

    console.log('Custom token received:', data.token);

    // Log in using the custom token
    await setPersistence(auth, browserSessionPersistence);
    const userCredential = await signInWithCustomToken(auth, data.token);

    console.log('Logged in with custom token:', userCredential.user);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message || 'Login failed.' };
  }
}

// Logout user
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: error.message || 'Failed to log out' };
  }
}

export async function fetchUserProfile(uid) {
  if (!uid) throw new Error('UID is required to fetch user profile.');

  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log('User profile fetched:', userDoc.data());
      return userDoc.data();
    } else {
      console.warn('User profile not found:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Failed to fetch user profile. Please try again.');
  }
}

