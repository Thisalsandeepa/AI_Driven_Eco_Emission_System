# AI Driven Eco Emission System

An intelligent web-based platform that predicts vehicle emissions and offers eco-friendly recommendations using machine learning. Built with a MERN stack, FastAPI for ML integration, and supports real-time updates and scraping-based data enrichment.

---

## 🚀 Project Structure

- **frontend/** – React app for user interaction
- **backend/** – Node.js + Express.js server with MongoDB
- **ml-predict/** – FastAPI-based microservice for ML model inference
- **scraping/** – News scraper module to fetch articles related to emissions

---

## 🔧 1. Clone the Repository

```bash
git clone https://github.com/Thisalsandeepa/AI_Driven_Eco_Emission_System.git
cd AI_Driven_Eco_Emission_System
```

---

## 📦 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 🤖 3. Install ML Predict Service Dependencies

```bash
cd ../ml-predict
pip install -r requirements.txt
```

---

## 🌐 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ⚙️ 5. Run the Project

### Backend

```bash
cd backend
npm start
```

### ML Predict Service

```bash
cd ../ml-predict
uvicorn app:app --reload
```

### Frontend

```bash
cd ../frontend
npm run dev
```

---

## 🧪 Sample Prediction Workflow

1. Fill in the vehicle details in the frontend form.
2. Submit to get the CO₂ emissions prediction and eco-friendly driving tips.
3. Data gets stored in MongoDB and rendered in the results dashboard.

---

## 📰 News Scraper (Optional)

Run the scraper to fetch the latest emission-related articles:

```bash
cd scraping
python insert_dummy_articles.py
```

---

## ✅ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **ML Microservice**: Python, FastAPI, Uvicorn
- **Tools**: GitHub Actions, Docker, WebSockets, News Scraping

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Contributors

- Thisal Sandeepa – [GitHub](https://github.com/Thisalsandeepa)
