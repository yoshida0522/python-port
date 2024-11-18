import Menu from "./components/Menu/Menu";
import Target from "./components/Target/Target";
import style from "./page.module.css";

export default function Home() {
  return (
    <div className={style.container}>
      <Target />
      <Menu />
    </div>
  );
}
