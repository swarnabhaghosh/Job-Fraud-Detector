from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import re

app = Flask(__name__)
CORS(app)

# Load model & tokenizer
model = tf.keras.models.load_model("lstm_model.keras")
tokenizer = pickle.load(open("tokenizer.pkl", "rb"))

MAX_LEN = 300

def clean_text(text):
    text = text.lower()
    text = re.sub(r"<.*?>", " ", text)
    text = re.sub(r"[^a-z ]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text

@app.route("/")
def home():
    return "API is running"

@app.route("/predict", methods=["POST"])
def predict():

    if not request.is_json:
        return jsonify({"error": "JSON required"}), 400

    data = request.json

    if "description" in data and len(data) == 1:
        combined_text = data["description"]
    else:
        combined_text = " ".join([
            data.get("title", ""),
            data.get("company_profile", ""),
            data.get("description", ""),
            data.get("requirements", ""),
            data.get("benefits", ""),
            data.get("salary_range", ""),
            "remote job" if data.get("remote") else "on site job",
            "company website available" if data.get("has_company_website") else "no company website"
        ])

    cleaned = clean_text(combined_text)
    seq = tokenizer.texts_to_sequences([cleaned])
    padded = pad_sequences(seq, maxlen=MAX_LEN)

    prediction = model.predict(padded)[0][0]

    return jsonify({
        "score": float(prediction),
        "result": "Fake Job" if prediction > 0.5 else "Real Job"
    })

app.run(debug=True)
