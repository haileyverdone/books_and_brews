import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '$lib/firebaseConfig';

export async function GET({ params }) {
  const { id } = params;

  try {
    console.log("Fetching profile for user ID:", id); // Debug log
    
    const userDoc = await getDoc(doc(db, 'users', id));

    if (userDoc.exists()) {
      console.log("Profile data found:", userDoc.data()); // Debug log
      return new Response(
        JSON.stringify({ profile: userDoc.data() }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('Profile not found'); // Debug log
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching profile:', error.message); // Detailed error log
    return new Response(
      JSON.stringify({ error: 'Server error fetching profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
