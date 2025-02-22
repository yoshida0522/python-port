export interface Task {
  task_id: string;
  title: string;
  description: string;
  implementation_date: string;
  user_id: string;
  completed: boolean;
}

export interface HistoryEntry {
  question: string;
  answer: string;
}

export interface UseSendRequestReturn {
  question: string;
  setQuestion: (value: string) => void;
  history: HistoryEntry[];
  sendRequest: () => Promise<void>;
  loading: boolean;
  conversationId: string;
  error: string | null;
}

export interface UserData {
  name: string;
  email: string;
  goal: string;
  duration: string;
  daily_time: string;
  approach: string;
}

export interface UserInfo {
  name: string;
  email: string;
  user_id: string;
  handleBack: () => void;
}

export interface TargetProps {
  goal?: string;
  daily?: string;
  user_id: string;
}

export interface WorkflowInput {
  goal: string;
  duration: string;
  daily_time: string;
  level: string;
  approach: string;
}

export interface WorkflowOutput {
  outputs: {
    answer: string;
  };
}

export interface TaskObj {
  user_id: string;
  title: string;
  implementation_date: string;
  description: string;
  completed: boolean;
}

export interface BarGraphData {
  dates: string[];
  achievements: number[];
}

export interface GraphDataResponse {
  task_date: string;
  completion_rate: number;
}

export interface GraphData {
  dates: string[];
  achievements: number[];
}

export interface UserGoalData {
  goal: string;
  user_id: string;
  duration: string;
}

export interface UserIdData {
  user_id: string;
}

export interface GoalDataProps {
  goal: string;
  duration: string;
  daily_time: string;
  level: string;
  approach: string;
}
