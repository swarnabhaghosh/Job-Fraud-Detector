import streamlit as st
import tensorflow as tf
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load model & tokenizer
model = tf.keras.models.load_model("models/lstm_model.keras")
with open("models/tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

MAX_LEN = 200

# ---------- UI ----------
st.title("🕵️ Fake Job Detection System")

input_type = st.radio(
    "Select Input Type",
    ["One Line Input", "All Parameters"]
)

# ---------- INPUT HANDLING ----------
if input_type == "One Line Input":
    text = st.text_area("Enter Job Description")

else:
    title = st.text_input("Job Title")
    company_profile = st.text_input("Company Profile")
    description = st.text_area("Description")
    requirements = st.text_area("Requirements")
    benefits = st.text_input("Benefits")

    # ----- Salary (Optional) -----
    st.subheader("Salary (Optional)")
    enable_salary = st.checkbox("Specify Salary")

    salary_min = ""
    salary_max = ""

    currency = st.selectbox(
        "Currency",
        ["Select Currency", "Dirhams", "Euros", "Rupees", "USD", "Yen"],
        index=0
    )

    if enable_salary:
        col1, col2 = st.columns(2)
        with col1:
            salary_min = st.text_input("Minimum Salary")
        with col2:
            salary_max = st.text_input("Maximum Salary")

    salary_range = salary_min + " - " + salary_max

    # ----- Toggles -----
    remote = st.toggle("Remote Job")
    has_company_website = st.toggle("Has Company Website")

    # ----- Merge ALL fields into ONE text -----
    text = f"""
    Title: {title}
    Company Profile: {company_profile}
    Description: {description}
    Requirements: {requirements}
    Benefits: {benefits}
    Salary: {salary_range if salary_range else "Not specified"} {currency if salary_range else ""}
    Remote: {remote}
    Company Website: {has_company_website}
    """

# ---------- PREDICTION ----------
if st.button("Check Job"):
    if text.strip() == "":
        st.warning("Please enter job details")
    else:
        seq = tokenizer.texts_to_sequences([text])
        padded = pad_sequences(seq, maxlen=MAX_LEN)

        prediction = model.predict(padded)[0][0]

        if prediction > 0.5:
            st.error(f"🚨 Fake Job Detected (Confidence: {prediction:.2f})")
        else:
            st.success(f"✅ Real Job (Confidence: {1 - prediction:.2f})")