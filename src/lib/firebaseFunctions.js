import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Fetch total number of posts
export async function fetchPostCount() {
  const postsCollection = collection(db, "posts");
  const snapshot = await getDocs(postsCollection);
  return snapshot.size; // Total number of documents
}

// Fetch active members (users active in the last 30 days)
export async function fetchActiveUserCount() {
  const usersCollection = collection(db, "users");
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)).toISOString();

  const activeUsersQuery = query(usersCollection, where("lastActive", ">=", thirtyDaysAgo));
  const snapshot = await getDocs(activeUsersQuery);
  return snapshot.size; // Total active users
}
