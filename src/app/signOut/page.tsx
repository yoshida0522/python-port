"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "../firebase";

const SignOut: React.FC = () => {
  const router = useRouter();
  const [dialogShown, setDialogShown] = useState(false);

  useEffect(() => {
    const signOutUser = async (): Promise<void> => {
      const auth = getAuth(firebaseApp);
      try {
        await signOut(auth);
        console.log("Signed out successfully");
        router.push("/");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error during sign-out:", error.message);
        } else {
          console.error("Unexpected error during sign-out.");
        }
      }
    };

    if (!dialogShown) {
      setDialogShown(true);
      const confirmation = window.confirm("サインアウトしてもよろしいですか？");
      if (confirmation) {
        signOutUser();
      } else {
        router.push("/");
      }
    }
  }, [dialogShown, router]);

  return null;
};

export default SignOut;
