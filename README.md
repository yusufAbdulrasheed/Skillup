# SkillUp Backend API

SkillUp is a robust and scalable **backend API** designed to manage an **online learning platform** where students can register, log in, browse courses, enroll, complete lessons, and track their progress. The system also integrates **payment processing** for course purchases and includes security measures, authentication, and rate-limiting to ensure reliability.

---

## 🚀 Features

- **User Authentication & Authorization**
  - Register, login, and secure JWT-based authentication
  - Role-based access control (Students, Admins, Recruiters, etc.)
- **Course Management**
  - Create, fetch, and manage courses
  - Structured lesson handling
- **Lesson Progress Tracking**
  - Students can mark lessons as completed
  - Progress data stored in MongoDB
- **Payments Integration**
  - Secure payment flow using **Stripe** or **Paystack**
  - Success and cancel URLs supported
- **Security**
  - Rate limiting using `express-rate-limit`
  - CORS enabled
  - Helmet for enhanced security headers
- **Real-time Updates**
  - Integrated with **Socket.IO** for live notifications
- **Logging & Monitoring**
  - Integrated with **Winston** and **Morgan** for structured logging
- **Job Queues**
  - Email notifications & background tasks handled with **BullMQ** + **Redis**

---

## 🛠️ Tech Stack

| **Technology** | **Purpose** |
|---------------|------------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **Redis + BullMQ** | Job queues & caching |
| **Socket.IO** | Real-time communication |
| **Stripe / Paystack** | Payment gateway |
| **Winston & Morgan** | Logging |
| **Joi** | Request validation |
| **Helmet** | Security headers |
| **CORS** | Cross-origin requests |
| **Express-rate-limit** | API rate limiting |

---

## 📂 Project Structure

```
SkillUp/
├── src/
│   ├── controllers/       # Route controllers (business logic)
│   ├── middlewares/       # Authentication, rate limiting, etc.
│   ├── models/            # Mongoose models (User, Course, Lesson, etc.)
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions (email, payment, etc.)
│   ├── config/            # Database & third-party service configs
│   └── server.js          # App entry point
├── .env                   # Environment variables
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/skillup-backend.git
cd skillup-backend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file in the root directory and add the following:

```env
PORT=your_port
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
NODE_ENV=development
```

> ⚠️ **Note:** Replace the placeholders with your actual credentials.

### 4️⃣ Start the development server
```bash
npm run dev
```

---

## 🔑 API Endpoints

### **Auth Routes**

| Method | Endpoint             | Description                | Auth |
| ------ | -------------------- | -------------------------- | ---- |
| POST   | `/api/auth/register` | Register a new user        | ❌    |
| POST   | `/api/auth/login`    | Login and get token        | ❌    |
| GET    | `/api/auth/profile`  | Get logged-in user profile | ✅    |
| PUT    | `/api/auth/profile`  | Update user profile        | ✅    |

### **Course Routes**

| Method | Endpoint           | Description         | Auth      |
| ------ | ------------------ | ------------------- | --------- |
| GET    | `/api/courses`     | Get all courses     | ❌         |
| GET    | `/api/courses/:id` | Get single course   | ❌         |
| POST   | `/api/courses`     | Create a new course | ✅ (Admin) |
| PUT    | `/api/courses/:id` | Update course       | ✅ (Admin) |

### **Lesson Progress**

| Method | Endpoint                          | Description                | Auth |
| ------ | --------------------------------- | -------------------------- | ---- |
| POST   | `/api/lessons/:lessonId/complete` | Mark a lesson as completed | ✅    |

---

## 🔒 Security & Rate Limiting

- Requests are **rate-limited** using `express-rate-limit`
- **Helmet** is used to secure HTTP headers
- CORS is enabled to allow secure cross-origin requests

---

## 🧪 Testing

Run tests using:

```bash
npm test
```

---

## 📌 Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm start`    | Start production server  |
| `npm test`     | Run tests                |
| `npm run lint` | Run ESLint               |

---

## 📜 Logging

- **Morgan** → HTTP request logging (development)


---

## 🛠 Dependencies Overview

| Package                | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| **cookie-parser**      | Parse cookies from requests                     |
| **cors**               | Enable cross-origin requests                    |
| **express-rate-limit** | Limit API requests to prevent abuse             |
| **helmet**             | Secure HTTP headers                             |

---

## 👨‍💻 Author

**Abdulrasheed Yusuf**  
Backend Developer | Node.js | Express | MongoDB

- 📧 Email: [yusufabdulrasheed200@gmail.com](mailto:yusufabdulrasheed200@gmail.com)
- 🌐 Portfolio: [http://abdulrasheedyusuf.vercel.app/](http://abdulrasheedyusuf.vercel.app/)
- 🐙 GitHub: [https://github.com/yusufAbdulrasheed](https://github.com/yusufAbdulrasheed)

---

## ⭐ Contributing

Contributions are welcome!
Feel free to **fork** the repo, make improvements, and submit a **pull request**.

---

## 🔗 Acknowledgments

- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [Stripe](https://stripe.com)
- [Socket.IO](https://socket.io)
- [Redis](https://redis.io)