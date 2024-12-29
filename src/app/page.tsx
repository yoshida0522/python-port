"use client";
import React, { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { firebaseApp } from "./firebase";
import Menu from "../app/components/Menu/Menu";
import PieGraph from "../app/components/PieGraph/PieGraph";
import BarGraph from "../app/barGraph/BarGraph";
import Target from "../app/components/Target/Target";
import { userGoal } from "../app/api/userGoal";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";
import { UserGoalData } from "./types";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserGoalData | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const userId = currentUser.uid;
        console.log("User ID being sent to API:", userId);
        const data = await userGoal(userId);
        console.log("Fetched user data:", data);
        setUserData(data);
      } else {
        setUserData(null);
      }
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
      console.log("Signed in as:", loggedInUser);

      const response = await fetch("http://localhost:8000/users", {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error during sign-in:", error.message);
      } else {
        console.error("Unexpected error during sign-in.");
      }
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className={styles.signIn}>
        <button className={styles.signInButton} onClick={handleGoogleSignIn}>
          Googleでサインイン
        </button>
      </div>
    );
  }

  if (!userData) {
    return <div>Failed to load user data.</div>;
  }

  const currentGraph = searchParams.get("graph") === "1" ? 1 : 0;

  return (
    <div className={styles.container}>
      <Target goal={userData.goal} daily={userData.duration} />
      <div className={styles.graphContainer}>
        {currentGraph === 0 && (
          <a
            href={`/?graph=0`}
            className={styles.prevButton}
            style={{ visibility: "hidden" }}
          >
            ◀
          </a>
        )}
        {currentGraph === 1 && (
          <a
            href={`/?graph=1`}
            className={styles.nextButton}
            style={{ visibility: "hidden" }}
          >
            ▶
          </a>
        )}
        {currentGraph === 0 ? <PieGraph /> : <BarGraph />}
        {currentGraph === 1 && (
          <a href={`/?graph=0`} className={styles.prevButton}>
            ◀
          </a>
        )}
        {currentGraph === 0 && (
          <a href={`/?graph=1`} className={styles.nextButton}>
            ▶
          </a>
        )}
      </div>
      <Menu />
    </div>
  );
}
