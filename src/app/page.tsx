"use client";
import React, { useState, useEffect } from "react";
import { userGoal } from "../app/api/userGoal";
import Menu from "../app/components/Menu/Menu";
import PieGraph from "../app/components/PieGraph/PieGraph";
import BarGraph from "../app/BarGraph/BarGraph";
import Target from "../app/components/Target/Target";
import styles from "./page.module.css";
import { UserGoalData } from "./types";
import { useGoogleSignIn } from "../app/utils/useGoogleSignIn";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserGoalData | null>(null);
  const [currentGraph, setCurrentGraph] = useState<number>(0);
  const { user, loading: authLoading, handleGoogleSignIn } = useGoogleSignIn();

  useEffect(() => {
    if (!authLoading && user) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const user_id = user.uid;
          const data = await userGoal(user_id);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [authLoading, user]);

  if (authLoading || loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className={styles.signIn}>
        <button className={styles.signInButton} onClick={handleGoogleSignIn}>
          Googleでサインイン
        </button>
      </div>
    );
  }

  if (!userData) return <div>Failed to load user data.</div>;

  const handleSlideChange = (direction: number) => {
    setCurrentGraph((prevGraph) => (prevGraph + direction + 2) % 2);
  };

  return (
    <div className={styles.container}>
      <Target
        goal={userData.goal}
        daily={userData.duration}
        user_id={userData.user_id}
      />
      <div className={styles.carouselContainer}>
        <div
          className={styles.carousel}
          style={{
            transform: `translateX(-${currentGraph * 100}%)`,
            transition: "transform 0.5s ease",
          }}
        >
          <div className={styles.carouselItem}>
            <PieGraph user_id={userData.user_id} />
          </div>
          <div className={styles.carouselItem}>
            <BarGraph user_id={userData.user_id} />
          </div>
        </div>
        <div className={styles.navigationButtons}>
          <button
            className={styles.prevButton}
            onClick={() => handleSlideChange(-1)}
          >
            ◀
          </button>
          <button
            className={styles.nextButton}
            onClick={() => handleSlideChange(1)}
          >
            ▶
          </button>
        </div>
      </div>
      <Menu user_id={userData.user_id} />
    </div>
  );
}
