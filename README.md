# 目標達成アプリ

## アプリ URL

https://

## アプリについて

生成 AI を用いた目標達成アプリです。<br>
達成したい目標を入力するだけで、タスクを自動生成します。<br>

### 【 ログイン画面 】

Google のアカウントでログインします。
![Image](https://github.com/user-attachments/assets/18012148-6631-4092-9f18-d98b0a96c512)<br>
<br>

### 【 メイン画面 】

目標設定をしていない場合は下記のような画面になります。
![Image](https://github.com/user-attachments/assets/f81b33b1-3f81-451f-a727-6c66cc5aa4bc)<br>
<br>

目標設定が終わっている場合は、中央に円グラフが表示されます。
![Image](https://github.com/user-attachments/assets/7b7440ab-04c4-4416-bb73-2faae8880900)<br>
<br>

### 【 進捗入力画面 】

その日のタスクが表示されます。<br>
タスクをクリックすることで完了と未完了の切り替えができます。<br>
また、完了したタスクは緑色で表示され、メイン画面の円グラフに反映されます。<br>
その日のタスクが全て完了または、未完了のタスクが残ったまま作業をやめる場合は、進捗報告を押してください。<br>
進捗報告を押すと、その日のタスクの達成度を計算し、メイン画面に棒グラフを作成します。<br>
また、未完了のタスクが残っている場合は、翌日分のタスクに自動追加されます。<br>

![Image](https://github.com/user-attachments/assets/8acaa016-09ea-4cbd-9866-86504bde406a)<br>
<br>

### 【 タスク確認画面 】

生成したタスク全てを確認することができます。<br>

![Image](https://github.com/user-attachments/assets/6c98dcb8-979a-494c-b71b-2d25bba1d315)<br>
<br>

### 【 目標設定画面 】

この画面では、チャットボットと会話をしながら目標の設定をします。<br>
まず最初に達成したい目標を入力し、送信を押してください。<br>
![Image](https://github.com/user-attachments/assets/23f00b08-170c-44e3-a555-301d83efa299)<br>
<br>
チャットボットから質問された内容を入力し、送信を押してください。<br>
![Image](https://github.com/user-attachments/assets/d2f55e78-3996-4e2f-b118-e9cc9832b46e)<br>
<br>
ヒアリング内容に間違いがなければ保存を押してください。<br>
![Image](https://github.com/user-attachments/assets/fce43671-43b2-4e96-acda-e9be833300fe)<br>
<br>
保存を押すと、Dify のワークフローが実行されタスクが生成されます。<br>

![Image](https://github.com/user-attachments/assets/d685a68c-9b09-46b2-a01b-bcea439c806e)<br>
<br>

### 【 設定画面 】

ユーザー情報の確認や、目標設定でヒアリングした内容が確認できます。<br>

![Image](https://github.com/user-attachments/assets/749d3e26-ca0d-4636-9bd3-84ea455d6c6a)<br>
<br>

## 使用技術

### 【フロントエンド】

- HTML
- CSS
- TypeScript
- Next.js(React)

### 【バックエンド】

- Python
- MongoDB
- FastAPI
- Firebase

### 【バージョン管理】

- GitHub

### 【デプロイ】

- Vercel

### 【API】

- Dify(チャットボット API)
- Dify(ワークフロー API)
- チャット GPT(オープン AI)

### 【環境変数】

.env ファイルを作成し、以下のように記述してください。

```bash
NEXT_PUBLIC_DIFY_API_KEY=YOUR_DIFY_API_KEY
NEXT_PUBLIC_DIFY_WORKFLOW_API_KEY=YOUR_DIFY_WORKFLOW_API_KEY
NEXT_PUBLIC_FIREBASE_API_URL=YOUR_FIREBASE_API_URL
NEXT_PUBLIC_DOMAIN=YOUR_DOMAIN
NEXT_PUBLIC_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_APP_ID=YOUR_APP_ID
```
