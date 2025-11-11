import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "user123")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "user123")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/oceanguard")
