# backend/database/mongo.py

from flask_pymongo import PyMongo

# Create a single PyMongo instance (like a connection manager)
mongo = PyMongo()
