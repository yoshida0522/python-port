from pymongo import MongoClient

# MongoDBに接続
client = MongoClient("mongodb://localhost:27017/")
db = client["python_port"]  # データベース名
