# 🚗 ParkSmart - Digital Parking Management System

A **web-based smart parking management application** built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **Firebase**. This system allows users to find and book parking slots online with real-time availability tracking and secure authentication.

---

## 🧩 Features

*   🔐 **Firebase Authentication** – Secure user registration and login.
*   🕒 **Real-Time Slot Availability** – View available parking slots from a Firestore database.
*   💳 **Online Booking** – Reserve parking spots with start and end times.
*   📊 **Admin Dashboard** – Manage parking locations and view overall occupancy.
*   📱 **Responsive UI** – Built with ShadCN UI components and Tailwind CSS for a modern, scalable design.

---

## 🏗️ Tech Stack

| Category         | Technology                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| **Framework**    | [Next.js](https://nextjs.org/) (with App Router)                        |
| **UI**           | [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/) |
| **Language**     | [TypeScript](https://www.typescriptlang.org/)                         |
| **Backend**      | [Firebase](https://firebase.google.com/) (Authentication & Firestore) |
| **GenAI**        | [Genkit](https://firebase.google.com/docs/genkit)                     |

---

## ⚙️ Running the Project Locally

To run this project on your local machine, follow these steps.

### 1. Install Dependencies

First, you need to install the necessary Node.js packages. Open your terminal in the project's root directory and run:

```bash
npm install
```

### 2. Run the Development Server

Once the dependencies are installed, you can start the Next.js development server. The project is configured to run on port `9002`.

```bash
npm run dev
```

The application will now be running at [http://localhost:9002](http://localhost:9002).

### Firebase Setup

This project is configured to connect to a Firebase project automatically. When you run the application for the first time, it will seed the Firestore database with initial data for parking locations.

---

## 🧰 Folder Structure

The project uses the Next.js App Router structure.

```
parksmart-app/
│
├── src/
│   ├── app/                 # Main application routes and pages
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── dashboard/       # User dashboard pages
│   │   ├── layout.tsx
│   │   └── page.tsx         # Login page
│   │
│   ├── components/          # Reusable React components
│   │   ├── ui/              # ShadCN UI components
│   │   └── ...
│   │
│   ├── firebase/            # Firebase configuration and hooks
│   │
│   ├── lib/                 # Utility functions, data types, etc.
│   └── ...
│
├── public/                  # Static assets
├── package.json             # Project dependencies and scripts
└── next.config.ts           # Next.js configuration
```
