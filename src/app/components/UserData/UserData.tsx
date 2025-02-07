import { UserInfo } from "@/app/types";
import style from "./page.module.css";

const UserData: React.FC<UserInfo> = ({ name, user_id, email, handleBack }) => {
  return (
    <div className={style.userForm}>
      <h2 className={style.title}>ユーザー情報</h2>
      <div className={style.user}>
        <label className={style.nameLabel}>ユーザー名</label>
        <input className={style.userInput} value={name} readOnly />
      </div>
      <div className={style.user}>
        <label className={style.idLabel}>ID</label>
        <input className={style.userInput} value={user_id} readOnly></input>
      </div>
      <div className={style.user}>
        <label className={style.mailLabel}>メールアドレス</label>
        <input className={style.userInput} value={email} readOnly />
      </div>
      <button onClick={handleBack} className={style.backButton}>
        戻る
      </button>
    </div>
  );
};

export default UserData;
