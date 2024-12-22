import Menu from "./components/Menu/Menu";
import PieGraph from "./components/PieGraph/PieGraph";
import BarGraph from "./barGraph/BarGraph";
import Target from "./components/Target/Target";
import { userGoal } from "./api/userGoal";
import styles from "./page.module.css";

export async function generateMetadata() {
  return { title: "Dashboard" };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { graph?: string };
}) {
  const userId = "674d18bcc09c624f84d48a5f";
  const userData = await userGoal(userId);
  const currentGraph = searchParams.graph === "1" ? 1 : 0;

  if (!userData) {
    return <div>Failed to load user data.</div>;
  }

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
