import { adminAuth, adminFirestore } from './firebaseAdmin'; // Import Firebase Admin SDK

// Register a new user and save their profile
export async function register(email, password, name, username) {
  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: false,
      displayName: name,
    });

    await adminFirestore.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      username,
      email,
      createdAt: new Date(),
    });

    console.log('User registered successfully:', userRecord);
    return { success: true, user: userRecord, message: 'Registration successful! Please verify your email.' };
    await sendEmailVerification(userCredential.user);
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: error.message || 'Failed to register user' };
  }
}

// Login user (handled by Firebase Auth on the client side, so no Admin SDK needed)
export async function loginUser(email, password) {
  try {
    return signInWithEmailAndPassword(auth,email,password);
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
}

// Fetch a user profile from Firestore
export async function fetchUserProfile(uid) {
  try {
    const userDoc = await adminFirestore.collection('users').doc(uid).get();
    if (userDoc.exists) {
      console.log('Fetched user profile data:', userDoc.data());
      return { success: true, data: userDoc.data() };
    } else {
      throw new Error('User profile not found.');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, message: error.message || 'Failed to fetch user profile' };
  }
}

// Save or update a user's profile in Firestore
export async function saveUserProfile(uid, profileData) {
  try {
    await adminFirestore.collection('users').doc(uid).set(profileData, { merge: true });
    console.log('User profile updated successfully.');
    return { success: true };
  } catch (error) {
    console.error('Error saving user profile:', error);
    return { success: false, message: error.message || 'Failed to save user profile' };
  }
}
