# 🛡️ Job Fraud Detector

An AI-based web application that detects **fake job postings** using **Natural Language Processing (NLP)** and **Machine Learning**.  
The system analyzes job descriptions and predicts whether a job is **Real or Fake**, along with explanations to help users understand the result.

---

##  Live Demo

🔗 **Live Website:**  
https://job-fraud-detector.vercel.app/

---

##  Problem Statement

With the rapid growth of online job portals and social media hiring, fake job postings have become a serious concern.  
Many existing systems only classify jobs as fake or real without explaining *why*, which reduces user trust.

This project aims to **detect fraudulent job postings** and provide **clear explanations** for each prediction.

---

##  Solution Overview

The Job Fraud Detector uses:
- **NLP techniques** to understand job descriptions
- An **LSTM-based deep learning model** to classify job postings
- An **Explainable AI layer** to highlight suspicious patterns

The system supports **two types of input**:
- Paragraph-based job description
- Structured job details (title, company, salary, etc.)

---

##  Features

-  Detects **Fake or Real** job postings  
-  Supports **Paragraph Input** and **Structured Input**  
-  Uses **LSTM (TensorFlow)** for prediction  
-  Shows **prediction probability**  
-  Provides **explanations** for suspicious jobs  
-  Simple and user-friendly web interface  

---

##  Architecture Overview

1. User enters job details via the web interface  
2. Data is sent to the Flask backend API  
3. NLP preprocessing is applied (cleaning, tokenization, padding)  
4. LSTM model predicts Fake or Real job  
5. Explainable AI highlights risk indicators  
6. Result is displayed to the user  

---

##  Tech Stack

**Frontend**
- Next.js
- Deployed on **Vercel**

**Backend**
- Python
- Flask REST API
- Deployed on **Render**

**Machine Learning**
- TensorFlow
- LSTM
- NLP preprocessing

---

##  MVP 

The MVP demonstrates:
- Paragraph input → Real & Fake job detection  
- Structured input → Real & Fake job detection  
- Explanation for suspicious job postings  


---

##  Contributors (Group Project)

- [Swarnabha Ghosh](https://github.com/swarnabhaghosh)
- [Biswasrita Hazra](https://github.com/Biswasrita)  
- [Bhumi Prasad](https://github.com/bhumiprasad14)
- [Soumalyo Kundu](https://github.com/soumalyokundu123)

---

##  Future Enhancements

- Deployment on Google Cloud Platform (GCP)
- Continuous model retraining with new data
- Integration of advanced models like BERT
- User authentication and history tracking

---

##  Disclaimer

This system provides **risk indicators**, not definitive proof.  
Users are advised to verify job postings through official company sources.

---

##  Acknowledgement

Developed as a group project to address real-world job fraud problems using AI and ML.


