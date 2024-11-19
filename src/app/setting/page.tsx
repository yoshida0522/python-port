"use client";
import React from "react";
import style from "./page.module.css";
import { useRouter } from "next/navigation";

const Setting = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <div className={style.userForm}>
        <h2 className={style.title}>ユーザー情報</h2>
        <div className={style.user}>
          <label className={style.nameLabel}>ユーザー名</label>
          <input className={style.userInput}></input>
        </div>
        <div className={style.user}>
          <label className={style.idLabel}>ID</label>
          <input className={style.userInput}></input>
        </div>
        <div className={style.user}>
          <label className={style.mailLabel}>メールアドレス</label>
          <input className={style.userInput}></input>
        </div>
        <button onClick={handleBack} className={style.backButton}>
          戻る
        </button>
      </div>
    </>
  );
};

export default Setting;
