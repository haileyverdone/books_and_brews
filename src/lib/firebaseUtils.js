import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
      createdAt: new Date()
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      throw new Error('Email not verified. Please check your email for the verification link.');
    }

    console.log('User logged in successfully');
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message || 'Invalid email or password' };
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

// Fetch user profile data
export async function fetchUserProfile(uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log('Fetched user profile data:', userDoc.data());
      return { success: true, data: userDoc.data() };
    } else {
      throw new Error('User profile not found.');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { success: false, message: error.message || 'Failed to fetch user profile' };
  }
}
