# Fullstack Project: FastAPI Backend + Frontend

This project consists of a **FastAPI backend** and a **frontend** (ReactTS/Vite) running in parallel. Follow these instructions to set up and run the project locally.

---

## 1️⃣ Backend Setup

### 1.1 Add `.venv` File
Create a `.venv` file in the `backend` folder to store the **JWT algorithm and secret**.

### 1.2 Create & Activate Python Virtual Environment

```bash
cd backend
python -m venv venv

# Activate environment
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

### 1.3 Install Dependencies
pip install bcrypt>=4.3.0 \
            dnspython>=2.7.0 \
            email-validator>=2.2.0 \
            fastapi>=0.116.1 \
            motor>=3.7.1 \
            openai>=1.97.0 \
            passlib[bcrypt]>=1.7.4 \
            pyjwt>=2.10.1 \
            pymongo[srv]>=4.13.2 \
            python-decouple>=3.8 \
            python-dotenv>=1.1.1 \
            sqlalchemy>=2.0.41 \
            uvicorn>=0.35.0 \
            pydantic \
            transformers \
            torch


⚠️ transformers and torch are optional, only required for AI functionality.
###1.4 Set JWT Secret

Open backend/app/api.py and update the secret on line 236 with your own secret key.

###1.5 Connect MongoDB Atlas

Create an account and cluster on MongoDB Atlas.
Connect your editor to Atlas .
Search for the connection string for FastAPI connection and copy it.
Paste it into line 7 of backend/app/database.py.

## 1️⃣ Backend Setup
###2.1 Install Dependencies
cd frontend
npm install

###2.2 Run the Project

Open two separate terminals:

# Terminal 1: Backend
cd backend
python main.py

# Terminal 2: Frontend
cd frontend
npm run dev
