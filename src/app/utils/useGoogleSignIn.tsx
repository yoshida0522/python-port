import { useState, useEffect } from "react";
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
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

      if (!response.ok) {
        throw new Error("ユーザー情報の送信に失敗しました。");
      }

      const data = await response.json();
      console.log(data.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`エラーが発生しました: ${err.message}`);
        console.error("SignIn Error:", err.message);
      } else {
        setError("予期しないエラーが発生しました。");
      }
    }
  };

  return { user, loading, error, handleGoogleSignIn };
};

// import { useState, useEffect } from "react";
// import {
//   getAuth,
//   signInWithPopup,
//   signInWithRedirect,
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   User,
// } from "firebase/auth";
// import { firebaseApp } from "../firebase";

// export const useGoogleSignIn = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//   useEffect(() => {
//     const auth = getAuth(firebaseApp);

//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleGoogleSignIn = async (): Promise<void> => {
//     const auth = getAuth(firebaseApp);
//     const provider = new GoogleAuthProvider();

//     try {
//       const result = await signInWithPopup(auth, provider);
//       const loggedInUser: User = result.user;
//       setUser(loggedInUser);

//       if (!BASE_URL) {
//         throw new Error("BASE_URLが設定されていません。");
//       }

//       const response = await fetch(`${BASE_URL}/users`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: loggedInUser.displayName,
//           user_id: loggedInUser.uid,
//           email: loggedInUser.email,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("ユーザー情報の送信に失敗しました。");
//       }

//       const data = await response.json();
//       console.log(data.message);
//     } catch (err: unknown) {
//       if (err instanceof Error && err.message.includes("popup")) {
//         try {
//           await signInWithRedirect(auth, provider);
//         } catch (redirectError: unknown) {
//           if (redirectError instanceof Error) {
//             setError(
//               `リダイレクトエラーが発生しました: ${redirectError.message}`
//             );
//             console.error("Redirect SignIn Error:", redirectError.message);
//           }
//         }
//       } else if (err instanceof Error) {
//         setError(`エラーが発生しました: ${err.message}`);
//       } else {
//         setError("予期しないエラーが発生しました。");
//       }
//     }
//   };

//   return { user, loading, error, handleGoogleSignIn };
// };
