# Book My Movie (BMM)

**Book My Movie (BMM)** is a full-stack MERN application for online movie ticket booking, inspired by platforms like BookMyShow.  
It enables users to browse movies, select theatres and shows, book seats, and make secure payments.  
The platform supports **role-based access** for Users, Partners (theatre owners), and Admins.

---

## Features

- **User Registration & Login:** Secure authentication with JWT, password hashing, and OTP-based password reset via email.  
- **Role-Based Access:**  
  - **User:** Browse movies, book tickets, view booking history.  
  - **Partner:** Add and manage theatres and shows.  
  - **Admin:** Approve or block theatres, add and manage movies.  
- **Movie Management:** Admins can add, edit, and delete movies.  
- **Theatre Management:** Partners can add theatres (admin approval required).  
- **Show Management:** Partners can add shows for their approved theatres.  
- **Seat Selection:** Interactive seat layout for booking.  
- **Stripe Payment Integration:** Secure online payments.  
- **Email Notifications:** OTP for password reset and booking confirmation.  
- **Booking History:** Users can view all previous bookings.  
- **Responsive UI:** Built with React and Ant Design for a modern, mobile-friendly experience.

---

## Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Redux Toolkit, Ant Design, React Router, Stripe.js |
| **Backend** | Node.js, Express, MongoDB (Mongoose), Stripe, Nodemailer |
| **Security** | JWT, bcrypt, Helmet, express-rate-limit, express-mongo-sanitize |
| **Deployment** | Vite (frontend), Node.js (backend) |

---

## Project Structure
```
book-my-movie/
├── client/ # Frontend (React + Vite)
│ ├── src/
│ │ ├── apicalls/ # API calls to backend
│ │ ├── components/ # Reusable React components
│ │ ├── pages/ # Page-level components (Home, Login, Register, Admin, Partner, Profile)
│ │ └── redux/ # Redux slices and store
│ ├── public/
│ └── package.json
│
├── server/ # Backend (Express + MongoDB)
│ ├── controllers/ # Express route controllers
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Express route definitions
│ ├── middlewares/ # Custom middlewares (auth, etc.)
│ ├── utils/ # Helpers (email templates, send mail)
│ ├── config/ # Database connection
│ ├── server.js # Entry point
│ └── package.json
│
└── README.md
```
---

## Flow Overview

1. **User Registration:**  
   Users register and select their role (User / Partner).  
2. **Partner Adds Theatre:**  
   Partner adds theatre → Admin approval required.  
3. **Admin Adds Movie:**  
   Admin adds movies to the system.  
4. **Partner Adds Show:**  
   Partner adds shows for their approved theatres using existing movies.  
5. **User Books Ticket:**  
   User selects movie, theatre, show, and seats → Pays via Stripe.  
6. **Email Notification:**  
   User receives booking confirmation via email.

---

## API Routes

###  User
```
POST /api/users/register → Register new user
POST /api/users/login → Login user
GET /api/users/current-user → Get current user (auth required)
PATCH /api/users/forgetpassword → Request OTP for password reset
PATCH /api/users/resetpassword → Reset password using OTP
```


###  Movie
```
POST /api/movies/add-movie → Add movie (admin)
GET /api/movies/get-all-movies → List all movies
GET /api/movies/movie/:movieId → Get movie details
PUT /api/movies/update-movie/:id → Update movie
DELETE /api/movies/delete-movie/:id → Delete movie
```

###  Theatre
```
POST /api/theatre/add-theatre → Add theatre (partner)
GET /api/theatre/get-all-theatres → List all theatres (admin)
GET /api/theatre/get-all-theatres/:id → List theatres by owner
PUT /api/theatre/update-theatre/:id → Update theatre
DELETE /api/theatre/delete-theatre/:id → Delete theatre
```

###  Show
```
POST /api/show/add-show → Add show (partner)
GET /api/show/get-all-shows-by-theatre/:id → Shows by theatre
GET /api/show/get-all-theatres-by-movie/:m/:d → Theatres by movie/date
GET /api/show/get-show/:id → Get show details
PUT /api/show/update-show/:id → Update show
DELETE /api/show/delete-show/:id → Delete show
```

###  Booking
```
GET /api/booking/get-all-bookings → Get user bookings
POST /api/booking/make-payment → Create Stripe payment intent
POST /api/booking/confirm-payment → Confirm Stripe payment
POST /api/booking/book-show → Book show after payment
```

---

## ⚙️ Getting Started

###  Prerequisites
- Node.js (v18+ recommended)  
- MongoDB (local or Atlas)  
- Stripe account (for API keys)  
- SendGrid account (for email API key)

---

###  Setup Instructions

#### 1️ Clone Repository
```
git clone https://github.com/NaveenBuidl/BMM.git
cd BMM
```
#### 2️ Backend Setup
```
cd server
npm install
```
Create a .env file inside /server with the following content:
```
MONGODB_URI=[your_mongodb_connection_string]
JWT_SECRET=[your_jwt_secret]
STRIPE_SECRET_KEY=[your_stripe_secret_key]
EMAIL_FROM=[your_verified_sendgrid_email]
SENDGRID_API_KEY=[your_sendgrid_api_key]
CLIENT_URL=http://localhost:5173

```
Start backend server:
```
npm run dev
```
#### 3️ Frontend Setup
```
cd ../client
npm install
```
Create a .env file inside /client:
```
VITE_STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
```
Start development server:
```
npm run dev
```
Then open http://localhost:5173 in your browser.


## Demo Credentials
Live demo → https://bmm-gjwc.onrender.com

## License
This project is licensed under the MIT License.

## Contributing
Pull requests are welcome!
For major changes, please open an issue first to discuss your proposal.

## Contact
For questions or support, please open a GitHub issue or email:
naveenbuidl@gmail.com
