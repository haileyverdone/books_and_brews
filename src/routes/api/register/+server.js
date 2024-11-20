import { register, saveUserProfile,sendEmailVerification } from '../../../lib/auth.js'; 

export async function POST({ request }) {
  const { name, username, email, password } = await request.json();

  try {
    // Register the user and get user credentials
    const userCredential = await register(email, password);
    const user = userCredential.user;

    if (!user) {
      throw new Error('User creation failed.');
    }

    // Send verification email
    await sendEmailVerification(user);
    console.log(`Verification email sent to: ${email}`);

    // Save user's additional profile data to Firestore
    await saveUserProfile(user.uid, {
      name,
      username,
      email,
      createdAt: new Date(),
    });

    // Return success response
    return new Response(
      JSON.stringify({ message: 'Registration successful. Please verify your email!' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to register user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
