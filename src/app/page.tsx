"use client";
import React, { useState, useEffect } from "react";
import { userGoal } from "../app/api/userGoal";
import Menu from "../app/components/Menu/Menu";
import PieGraph from "../app/components/PieGraph/PieGraph";
import BarGraph from "./BarGraph/BarGraph";
import Target from "../app/components/Target/Target";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";
import { UserGoalData } from "./types";
import { useGoogleSignIn } from "../app/utils/useGoogleSignIn";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserGoalData | null>(null);
  const searchParams = useSearchParams();
  const { user, loading: authLoading, handleGoogleSignIn } = useGoogleSignIn();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (user) {
      const fetchData = async () => {
        const userId = user.uid;
        const data = await userGoal(userId);
        setUserData(data);
      };

      fetchData();
    }

    setLoading(false);
  }, [authLoading, user]);

  if (authLoading || loading) {
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
      <Target
        goal={userData.goal}
        daily={userData.duration}
        userId={userData.user_id}
      />
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
        {currentGraph === 0 ? (
          <PieGraph userId={userData.user_id} />
        ) : (
          <BarGraph userId={userData.user_id} />
        )}
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
      <Menu userId={userData.user_id} />
    </div>
  );
}
