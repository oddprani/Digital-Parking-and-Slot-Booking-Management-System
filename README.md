# 🚗 Digital Parking and Slot Booking Management System

A **web-based smart parking management application** built using **TypeScript**, **CSS**, and a robust backend framework. This system allows users to find, book, and manage parking slots online with real-time availability tracking and secure authentication.

---

## 🧩 Features

* 🔐 **User Authentication** – Register, login, and manage profiles securely
* 🕒 **Real-Time Slot Availability** – View available parking slots based on time and location
* 💳 **Online Booking & Cancellation** – Reserve and cancel slots dynamically
* 💡 **Smart Pricing** – Dynamic pricing based on vehicle type and duration
* 📊 **Admin Dashboard** – Manage lots, track usage, and generate reports
* 📱 **Responsive UI** – Built with TypeScript and CSS for clean, scalable design

---

## 🏗️ System Architecture

The system follows a **client–server model**:

* **Frontend:** TypeScript + CSS
* **Backend:** Node.js / Express (TypeScript)
* **Database:** MongoDB or PostgreSQL
* **Authentication:** JWT (JSON Web Tokens)
* **Optional:** Razorpay / Stripe API for payments

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/digital-parking-system.git
cd digital-parking-system
```

### 2. Setup the Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env with Mongo URI and JWT_SECRET
npm run dev
```

### 3. Setup the Frontend

```bash
cd client
npm install
npm start
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧠 Technologies Used

| Category            | Technology                    |
| ------------------- | ----------------------------- |
| **Frontend**        | TypeScript, CSS, HTML         |
| **Backend**         | Node.js, Express (TypeScript) |
| **Database**        | MongoDB / PostgreSQL          |
| **Authentication**  | JWT                           |
| **Version Control** | Git & GitHub                  |
| **Optional APIs**   | Razorpay / Google Maps API    |

---

## 🧭 Project Workflow

1. User registers and logs in.
2. System displays available locations and slots.
3. User enters entry and exit times to check availability.
4. Pricing is calculated dynamically based on duration.
5. Booking is confirmed and visible on the user dashboard.
6. Users can cancel bookings; freed slots return to availability.
7. Admin can view analytics and generate usage reports.

---

## 🧰 Folder Structure

```
digital-parking-system/
│
├── client/                # Frontend (TypeScript + CSS)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── index.html
│   └── package.json
│
├── server/                # Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 📈 Future Enhancements

* 🌐 Integration with Google Maps for live parking navigation
* 🔔 Push notifications for booking reminders
* ⚡ AI-based predictive slot availability
* 🔌 EV charging slot support
* 📱 Mobile app version (React Native or Flutter)

---

## 🧑‍💻 Contributors

* **Vivek** – Developer & Designer
* **Project Type:** Academic / Smart City Initiative

---

