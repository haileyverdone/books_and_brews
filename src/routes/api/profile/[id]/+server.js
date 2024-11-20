import { adminFirestore } from "$lib/firebaseAdmin";

export async function GET({ params }) {
  const { id } = params;

  try {
    // Fetch the user profile from Firestore
    const userDoc = await adminFirestore.collection("users").doc(id).get();

    if (!userDoc.exists) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ profile: userDoc.data() }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return new Response(
      JSON.stringify({ error: "Server error fetching profile" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
