import { useState, useEffect, useMemo } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { firebaseApp } from "../firebase";

export const useGoogleSignIn = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_URL, []);

  useEffect(() => {
    const auth = getAuth(firebaseApp);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async (): Promise<void> => {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser: User = result.user;
      setUser(loggedInUser);

      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: loggedInUser.displayName,
          user_id: loggedInUser.uid,
          email: loggedInUser.email,
        }),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`エラーが発生しました: ${err.message}`);
      } else {
        setError("予期しないエラーが発生しました。");
      }
    }
  };

  return { user, loading, error, handleGoogleSignIn };
};
