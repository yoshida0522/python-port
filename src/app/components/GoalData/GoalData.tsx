import { GoalDataProps } from "@/app/types";
import style from "./page.module.css";

const GoalData: React.FC<GoalDataProps> = ({
  goal,
  duration,
  level,
  daily_time,
  approach,
}) => {
  return (
    <>
      <div className={style.hearing}>
        <h2>ヒアリング内容</h2>
      </div>
      <div className={style.hearingForm}>
        <div>
          <span className={style.hearingGoal}>目標</span>
          <input className={style.hearingInput} value={goal} readOnly />
        </div>
        <div>
          <span className={style.hearingDaily}>期間</span>
          <input className={style.hearingInput} value={duration} readOnly />
        </div>
        <div>
          <span className={style.hearingTime}>1日に割ける時間</span>
          <input className={style.hearingInput} value={daily_time} readOnly />
        </div>
        <div>
          <span className={style.hearingLevel}>目標達成レベル</span>
          <input className={style.hearingInput} value={level} readOnly />
        </div>
        <div>
          <span className={style.hearingProcedure}>進め方の希望</span>
          <input className={style.hearingInput} value={approach} readOnly />
        </div>
      </div>
    </>
  );
};

export default GoalData;
