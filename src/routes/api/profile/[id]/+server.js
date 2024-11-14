import { db } from '$lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export async function GET({ params }) {
  const { id } = params;

  try {
    // Reference the document in the 'users' collection with the provided ID
    const userDocRef = doc(db, 'users', id);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return new Response(
        JSON.stringify({ profile: userDoc.data() }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('Profile not found');
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    return new Response(
      JSON.stringify({ error: 'Server error fetching profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
