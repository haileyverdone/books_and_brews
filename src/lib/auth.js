import { SvelteKitAuth } from "@auth/sveltekit";
import CredentialsProvider from "@auth/core/providers/credentials";
import { db } from '$lib/db';  
import bcrypt from 'bcryptjs';
import { AUTH_SECRET } from '$env/static/private';  // Correct import for server-side secrets

export const handle = SvelteKitAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const result = await db.query('SELECT * FROM users WHERE username = $1', [credentials.username]);

        if (result.rows.length === 0) {
          return null;
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email
        };
      }
    })
  ],
  secret: AUTH_SECRET  // Using the secret from $env/static/private
});
