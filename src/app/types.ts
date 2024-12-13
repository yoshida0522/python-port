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
}

export interface UserData {
  name: string;
  email: string;
  goal: string;
  duration: string;
  daily_time: string;
  approach: string;
}

export interface TargetProps {
  goal: string;
  daily: string;
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
