from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import re
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
tf.config.threading.set_intra_op_parallelism_threads(1)
tf.config.threading.set_inter_op_parallelism_threads(1)


app = Flask(__name__)
CORS(app)

model = None
tokenizer = None

def load_model_once():
    global model, tokenizer
    if model is None:
        model = tf.keras.models.load_model("models/lstm_model.keras")
        with open("models/tokenizer.pkl", "rb") as f:
            tokenizer = pickle.load(f)


MAX_LEN = 300

def clean_text(text):
    text = text.lower()
    text = re.sub(r"<.*?>", " ", text)
    text = re.sub(r"[^a-z ]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text

def find_risk_indicators(text, data):
    indicators = []
    lower_text = text.lower()

    SCAM_KEYWORDS = [
        "earn money fast",
        "instant payment",
        "limited seats",
        "quick money",
        "high salary",
        "no experience"
    ]

    for kw in SCAM_KEYWORDS:
        if kw in lower_text:
            indicators.append(
                f"Contains phrase '{kw}', which is sometimes used in scam postings"
            )

    if data.get("has_company_website") is False:
        indicators.append(
            "This company has no website, this increases uncertainty"
        )
    elif data.get("has_company_website") is None:
        indicators.append(
            "Company website information was not provided, which increases uncertainty"
        )

    if len(lower_text.split()) < 30:
        indicators.append(
            "Job post has limited detail, making verification harder"
        )

    return indicators

def educational_message(indicators):
    if not indicators:
        return None

    return (
        "This job looks suspicious because scam postings often use urgency, "
        "vague benefits, or omit verifiable company information."
    )


@app.route("/")
def home():
    return "API is running"

@app.route("/", methods=["GET"])
def home():
    return "Job Fraud API is running"

@app.route("/", methods=["GET"])
def health():
    return {"status": "Backend running"}, 200

@app.route("/predict", methods=["POST"])
def predict():
    load_model_once()

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

            "remote job" if data.get("remote") is True
            else "on site job" if data.get("remote") is False
            else "",

            "company website available" if data.get("has_company_website") is True
            else "no company website" if data.get("has_company_website") is False
            else "company website is not mentioned"
        ])

    cleaned = clean_text(combined_text)
    seq = tokenizer.texts_to_sequences([cleaned])
    padded = pad_sequences(seq, maxlen=MAX_LEN)

    prediction = model.predict(padded, verbose=0)[0][0]
    is_fake = prediction > 0.5

    response = {
        "result": "Fake Job" if is_fake else "Real Job",
        "probability": float(prediction if is_fake else (1 - prediction))
    }

    if is_fake:
        indicators = find_risk_indicators(cleaned, data)
        response["risk_indicators"] = indicators
        response["note"] = "These are risk indicators, not definitive proof."
        response["education"] = educational_message(indicators)

    return jsonify(response)

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

