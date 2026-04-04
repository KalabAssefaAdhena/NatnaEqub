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
### Phase 1: Setup & Authentication

<p align="center"> <img src="screenshots/1.jpg" width="250" /> <img src="screenshots/2.jpg" width="250" /> <img src="screenshots/3.jpg" width="250" /> <img src="screenshots/4.jpg" width="250" /> <img src="screenshots/5.jpg" width="250" /> <img src="screenshots/6.jpg" width="250" /> <img src="screenshots/7.jpg" width="250" /> <img src="screenshots/8.jpg" width="250" /> <img src="screenshots/9.jpg" width="250" /> <img src="screenshots/10.jpg" width="250" /> <img src="screenshots/11.jpg" width="250" /> <img src="screenshots/12.jpg" width="250" /> </p>

### Phase 2: Dashboard & UI

<p align="center"> <img src="screenshots/13.jpg" width="250" /> <img src="screenshots/14.jpg" width="250" /> <img src="screenshots/15.jpg" width="250" /> <img src="screenshots/16.jpg" width="250" /> <img src="screenshots/17.jpg" width="250" /> <img src="screenshots/18.jpg" width="250" /> <img src="screenshots/19.jpg" width="250" /> <img src="screenshots/20.jpg" width="250" /> <img src="screenshots/21.jpg" width="250" /> <img src="screenshots/22.jpg" width="250" /> <img src="screenshots/23.jpg" width="250" /> <img src="screenshots/24.jpg" width="250" /> <img src="screenshots/25.jpg" width="250" /> <img src="screenshots/26.jpg" width="250" /> <img src="screenshots/27.jpg" width="250" /> <img src="screenshots/28.jpg" width="250" /> <img src="screenshots/29.jpg" width="250" /> <img src="screenshots/30.jpg" width="250" /> <img src="screenshots/31.jpg" width="250" /> <img src="screenshots/32.jpg" width="250" /> <img src="screenshots/33.jpg" width="250" /> <img src="screenshots/34.jpg" width="250" /> <img src="screenshots/35.jpg" width="250" /> <img src="screenshots/36.jpg" width="250" /> <img src="screenshots/37.jpg" width="250" /> </p>

### Phase 3: Payments & Rotation

<p align="center"> <img src="screenshots/38.jpg" width="250" /> <img src="screenshots/39.jpg" width="250" /> <img src="screenshots/40.jpg" width="250" /> <img src="screenshots/41.jpg" width="250" /> <img src="screenshots/42.jpg" width="250" /> <img src="screenshots/43.jpg" width="250" /> <img src="screenshots/44.jpg" width="250" /> <img src="screenshots/45.jpg" width="250" /> <img src="screenshots/46.jpg" width="250" /> <img src="screenshots/47.jpg" width="250" /> <img src="screenshots/48.jpg" width="250" /> <img src="screenshots/49.jpg" width="250" /> <img src="screenshots/50.jpg" width="250" /> </p>