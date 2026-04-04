# Natna Equb 🌞

Natna Equb is a **digital savings platform** that modernizes and automates the **traditional Ethiopian Equb system of group fund rotation**.
It is built with a React frontend, Django REST backend, and Chapa payment integration, enabling secure and efficient group savings in a digital form.

---

## Features

- Create private Equb groups (any user).
- Create public Equb groups (**only superuser / admin** via Django `createsuperuser`).
- Randomized rotations and digital payouts.
- Group creator manages contributions and service fees.
- Track payments and payouts.
- Mobile-friendly and simple dashboard.

---

## Project Structure

```
NatnaEqub/
├── backend/ # Django backend
│ └── .env.example # Example environment variables
├── frontend/ # React frontend
│ └── .env.example # Example environment variables
├── .gitignore # Files/folders to ignore
└── README.md
```

---

## Requirements

- Python 3.11+
- Node.js 18+ / npm 9+
- Django 4+
- React 18+
- Chapa account (for payment integration)

> ⚠️ Do NOT use `.env` from GitHub; use `.env.example` to create your own `.env`.

---

## Installation

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt      # Install dependencies
python manage.py migrate              # Apply migrations
python manage.py createsuperuser      # Optional: create superuser/admin
python manage.py runserver            # Start backend server


### 2. Frontend Setup

cd ../frontend
npm install                           # Install dependencies
npm run dev                            # Start frontend server

### 3. Open the App

Backend: http://localhost:8000
Frontend: http://localhost:5173

### Environment Variables
## Backend (backend/.env)

Copy .env.example and fill with real keys:

DJANGO_SECRET_KEY=your_django_secret_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
ACCESS_TOKEN_MINUTES=60
REFRESH_TOKEN_DAYS=7
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
CHAPA_PUBLIC_KEY=your_chapa_public_key_here
CHAPA_SECRET_KEY=your_chapa_secret_key_here
CHAPA_WEBHOOK_URL=https://your-backend-domain/api/payments/chapa/webhook/
CHAPA_CALLBACK_URL=https://your-backend-domain/api/payments/return/
CHAPA_SECRET_HASH=your_chapa_secret_hash_here


## Frontend (frontend/.env)

Copy .env.example and fill with real keys:

VITE_CHAPA_PUBLIC_KEY=your_chapa_public_key_here
VITE_BACKEND_URL=http://localhost:8000


## Usage

- Login and explore My Equb dashboard.
- Create or join private groups.
- Superuser can create public groups.
- Make contributions and track rotations.
- View winners and payouts.

## Notes

- Backend and frontend URLs must match your .env configuration.
- Service fees are charged by the group creator; Natna Equb takes 10% of the service fee.
- Always keep your .env secret; never commit it to GitHub.


```

MIT License

Copyright (c) 2025 Kalab

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

```

## 📸 Screenshots

### 🏗️ Project Progress

#### Phase 1: Setup & Authentication

![Step 1](screenshots/1.jpg)
![Step 2](screenshots/2.jpg)
![Step 3](screenshots/3.jpg)
![Step 4](screenshots/4.jpg)
![Step 5](screenshots/5.jpg)
![Step 6](screenshots/6.jpg)
![Step 7](screenshots/7.jpg)
![Step 8](screenshots/8.jpg)
![Step 9](screenshots/9.jpg)
![Step 10](screenshots/10.jpg)
![Step 11](screenshots/11.jpg)
![Step 12](screenshots/12.jpg)

---

#### Phase 2: Dashboard & UI

![Step 13](screenshots/13.jpg)
![Step 14](screenshots/14.jpg)
![Step 15](screenshots/15.jpg)
![Step 16](screenshots/16.jpg)
![Step 17](screenshots/17.jpg)
![Step 18](screenshots/18.jpg)
![Step 19](screenshots/19.jpg)
![Step 20](screenshots/20.jpg)
![Step 21](screenshots/21.jpg)
![Step 22](screenshots/22.jpg)
![Step 23](screenshots/23.jpg)
![Step 24](screenshots/24.jpg)
![Step 25](screenshots/25.jpg)
![Step 26](screenshots/26.jpg)
![Step 27](screenshots/27.jpg)
![Step 28](screenshots/28.jpg)
![Step 29](screenshots/29.jpg)
![Step 30](screenshots/30.jpg)
![Step 31](screenshots/31.jpg)
![Step 32](screenshots/32.jpg)
![Step 33](screenshots/33.jpg)
![Step 34](screenshots/34.jpg)
![Step 35](screenshots/35.jpg)
![Step 36](screenshots/36.jpg)
![Step 37](screenshots/37.jpg)

---

#### Phase 3: Payments & Rotation

![Step 38](screenshots/38.jpg)
![Step 39](screenshots/39.jpg)
![Step 40](screenshots/40.jpg)
![Step 41](screenshots/41.jpg)
![Step 42](screenshots/42.jpg)
![Step 43](screenshots/43.jpg)
![Step 44](screenshots/44.jpg)
![Step 45](screenshots/45.jpg)
![Step 46](screenshots/46.jpg)
![Step 47](screenshots/47.jpg)
![Step 48](screenshots/48.jpg)
![Step 49](screenshots/49.jpg)
![Step 50](screenshots/50.jpg)
