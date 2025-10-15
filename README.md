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
