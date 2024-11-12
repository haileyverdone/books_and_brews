import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '$lib/firebaseConfig';

const db = getFirestore(app);

export async function GET({ params }) {
  try {
    const userDoc = await getDoc(doc(db, 'users', params.id));

    if (userDoc.exists()) {
      return new Response(
        JSON.stringify({ profile: userDoc.data() }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching profile:', error);

    return new Response(
      JSON.stringify({ error: 'Server error fetching profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
