import React from "react";
import style from "./page.module.css";

const Menu = () => {
  return (
    <div className={style.menu}>
      <div className={style.menu1}>進捗入力</div>
      <div className={style.menu2}>タスク確認</div>
      <div className={style.menu3}>目標設定</div>
      <div className={style.menu4}>設定</div>
    </div>
  );
};

export default Menu;
