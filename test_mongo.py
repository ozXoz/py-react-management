from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)

# Replace with your actual MongoDB URI
app.config["MONGO_URI"] = "mongodb+srv://101303363:Azr2010q%2B@cluster0.wl4qo.mongodb.net/mydatabase?retryWrites=true&w=majority"
mongo = PyMongo(app)

@app.route('/test')
def test_db():
    try:
        # Attempt to access the database
        mongo.db.test_collection.insert_one({"test": "This is a test"})
        return "MongoDB connection is successful!", 200
    except Exception as e:
        return f"Error connecting to MongoDB: {str(e)}", 500

if __name__ == '__main__':
    app.run(debug=True)
