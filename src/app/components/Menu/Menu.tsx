import React from "react";
import style from "./page.module.css";
import Link from "next/link";
import { IoIosSettings } from "react-icons/io";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa";
import { VscSignOut } from "react-icons/vsc";
import { UserIdData } from "@/app/types";

const Menu: React.FC<UserIdData> = ({ userId }) => {
  return (
    <div className={style.menu}>
      <div className={style.menu1}>
        <Link className={style.link} href={`/analytics/${userId}`}>
          <FaRegCalendarCheck className={style.icon} />
          <span className={style.linkText}>進捗入力</span>
        </Link>
      </div>
      <div className={style.menu2}>
        <Link className={style.link} href={`/tasks/${userId}`}>
          <FaTasks className={style.icon} />
          <span className={style.linkText}>タスク確認</span>
        </Link>
      </div>
      <div className={style.menu3}>
        <Link className={style.link} href="/goals">
          <IoChatboxEllipsesOutline className={style.icon} />
          <span className={style.linkText}>目標設定</span>
        </Link>
      </div>
      <div className={style.menu4}>
        <Link className={style.link} href={`/setting/${userId}`}>
          <IoIosSettings className={style.icon} />
          <span className={style.linkText}>設定</span>
        </Link>
      </div>
      <div className={style.menu5}>
        <Link className={style.link} href="/signOut">
          <VscSignOut className={style.icon} />
          <span className={style.linkText}>サインアウト</span>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
