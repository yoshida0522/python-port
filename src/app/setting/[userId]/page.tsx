"use client";
import React, { useEffect, useState } from "react";
import style from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { userGoal } from "../../api/userGoal";

const Setting = () => {
  const router = useRouter();
  const { userId } = useParams();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    user_id: "",
    goal: "",
    duration: "",
    daily_time: "",
    level: "",
    approach: "",
  });

  useEffect(() => {
    const resolvedUserId = Array.isArray(userId) ? userId[0] : userId;
    if (resolvedUserId) {
      userGoal(resolvedUserId)
        .then((data) => setUserData(data))
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [userId]);

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <div className={style.userForm}>
        <h2 className={style.title}>ユーザー情報</h2>
        <div className={style.user}>
          <label className={style.nameLabel}>ユーザー名</label>
          <input className={style.userInput} value={userData.name} readOnly />
        </div>
        <div className={style.user}>
          <label className={style.idLabel}>ID</label>
          <input
            className={style.userInput}
            value={userData.user_id}
            readOnly
          ></input>
        </div>
        <div className={style.user}>
          <label className={style.mailLabel}>メールアドレス</label>
          <input className={style.userInput} value={userData.email} readOnly />
        </div>
        <button onClick={handleBack} className={style.backButton}>
          戻る
        </button>
      </div>
      <div className={style.hearing}>
        <h2>ヒアリング内容</h2>
      </div>
      <div className={style.hearingForm}>
        <div>
          <span className={style.hearingGoal}>目標</span>
          <input
            className={style.hearingInput}
            value={userData.goal}
            readOnly
          />
        </div>
        <div>
          <span className={style.hearingDaily}>期間</span>
          <input
            className={style.hearingInput}
            value={userData.duration}
            readOnly
          />
        </div>
        <div>
          <span className={style.hearingTime}>1日に割ける時間</span>
          <input
            className={style.hearingInput}
            value={userData.daily_time}
            readOnly
          />
        </div>
        <div>
          <span className={style.hearingLevel}>目標達成レベル</span>
          <input
            className={style.hearingInput}
            value={userData.level}
            readOnly
          />
        </div>
        <div>
          <span className={style.hearingProcedure}>進め方の希望</span>
          <input
            className={style.hearingInput}
            value={userData.approach}
            readOnly
          />
        </div>
      </div>
    </>
  );
};

export default Setting;
