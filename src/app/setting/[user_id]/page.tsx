"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { userGoal } from "../../api/userGoal";
import GoalData from "@/app/components/GoalData/GoalData";
import UserData from "@/app/components/UserData/UserData";

const Setting = () => {
  const router = useRouter();
  const { user_id } = useParams();
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
    const resolvedUserId = Array.isArray(user_id) ? user_id[0] : user_id;
    if (resolvedUserId) {
      userGoal(resolvedUserId)
        .then((data) => setUserData(data))
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [user_id]);

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <UserData
        name={userData.name}
        user_id={userData.user_id}
        email={userData.email}
        handleBack={handleBack}
      />
      <GoalData
        goal={userData.goal}
        duration={userData.duration}
        daily_time={userData.daily_time}
        level={userData.level}
        approach={userData.approach}
      />
    </>
  );
};

export default Setting;
