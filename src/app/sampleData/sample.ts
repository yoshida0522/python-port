export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

export const sampleData: Task[] = [
  {
    id: 1,
    title: "進捗入力ページ作成",
    description: "1件ずつタスクをカードスタイルで表示",
    isCompleted: false,
  },
  {
    id: 2,
    title: "設定ページ作成",
    description: "ユーザー名、ID、メールアドレス欄を作成",
    isCompleted: false,
  },
  {
    id: 3,
    title: "バックエンドの構築",
    description: "Difyの学習を全て終わらせる",
    isCompleted: false,
  },
];
