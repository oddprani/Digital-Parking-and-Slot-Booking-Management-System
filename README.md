# 🚗 ParkSmart - Chamarajanagara Digital Parking System

ParkSmart is a modern, web-based parking management and slot booking application tailored for Chamarajanagara, Karnataka. It allows users to find, check availability, and book parking spots in real-time, while providing administrators with a comprehensive dashboard to manage locations and track occupancy.

---

## 🏗️ Technical Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/) |
| **Backend** | [Firebase](https://firebase.google.com/) (Authentication & Cloud Firestore) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🧩 Key Features

### 👤 User Features
*   **Real-time Booking:** Browse parking locations in Chamarajanagara and book slots instantly.
*   **Digital Tickets:** Generate a printable parking ticket with a unique slot ID and vehicle details.
*   **Availability Calendar:** Check future availability for any location using an interactive calendar.
*   **Booking History:** Track upcoming, active, and completed parking sessions.
*   **Secure Auth:** Firebase-powered login and registration.

### 🛡️ Admin Features
*   **Global Overview:** Monitor total revenue, active bookings, and overall city-wide occupancy.
*   **Location Management:** Add, edit, and track specific parking lots (e.g., KSRTC Bus Stand, JSS College).
*   **Real-time Monitoring:** Live progress bars showing occupancy percentages for every location.
*   **Automatic Seeding:** The system automatically populates Chamarajanagara-specific data if the database is empty.

---

## ⚙️ Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository** (or download the source code).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
4.  **Access the app**:
    Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 📖 How to Use

### 1. Registration & Login
*   Navigate to the landing page.
*   If you don't have an account, click **Sign up** to create one.
*   Log in with your email and password.

### 2. Booking a Spot (User)
*   On the **Dashboard**, you'll see cards for different locations in Chamarajanagara.
*   Click **Book Now** on a location.
*   Fill in your **Name**, **Vehicle Number** (e.g., KA 10 M 1234), and select your **Entry/Exit times**.
*   Click **Confirm & Book**.
*   A **Parking Ticket** will be generated. You can print this ticket for offline use.

### 3. Checking Availability
*   Click the **Calendar icon** in the sidebar.
*   Select a location from the dropdown.
*   The calendar will show the number of available slots for each day.

### 4. Admin Dashboard
*   Click the **Admin View** icon (Layout grid) in the bottom of the sidebar.
*   **Overview**: View stats like total revenue and occupancy rates.
*   **Locations**: Manage the list of parking lots. If the list is empty, the app will automatically seed data for Chamarajanagara's key landmarks.

---

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (Routes & Pages)
│   ├── admin/            # Admin Dashboard routes
│   ├── dashboard/        # User Dashboard routes
│   └── (auth)/           # Login & Register pages
├── components/           # UI Components
│   ├── ui/               # ShadCN atomic components
│   ├── dashboard/        # Dashboard-specific components (Forms, Cards)
│   └── admin/            # Admin-specific components (Stats, Views)
├── firebase/             # Firebase config, hooks, and providers
├── lib/                  # Utilities, Types, and Zod Schemas
└── hooks/                # Custom React hooks (Toast, etc.)
```

---

## 🛡️ Security
The application uses **Firestore Security Rules** to ensure:
*   Users can only read and write their own bookings.
*   Parking locations are globally readable but protected for authorized modifications.
*   Authentication is required for all booking operations.

---
*This project was developed by reethu GB and Vivek Kalgurti**
