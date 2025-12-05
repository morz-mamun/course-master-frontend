# Course Master - Full Stack Learning Management System

## 📋 Project Overview

**Course Master** is a comprehensive full-stack Learning Management System (LMS) built with modern technologies. The platform enables students to browse and enroll in courses, track their learning progress, complete assignments and quizzes, while administrators can manage courses, create learning materials, and monitor student performance.

---

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Bearer Token in localStorage)
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **Development**: Nodemon, ts-node
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

#### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

---

---

## 🔑 Default Admin Credentials

After running the backend for the first time, an admin account is automatically created using the admin seeder script. You can use these credentials to access the admin panel:

> [!IMPORTANT]
> **Security Notice**: These are default credentials for development purposes. Make sure to change the admin password in production or use different credentials by updating the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables in your `.env` file before starting the backend.

**Admin Seeder Configuration:**
```env
ADMIN_EMAIL=admin@coursemaster.com
ADMIN_PASSWORD=Admin@123
```

---

## 📁 Project Structure

### Backend Structure
```
course-master-backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # MongoDB connection
│   │   ├── index.ts         # Environment config
│   │   └── jwt.ts           # JWT utilities
│   ├── controllers/         # Request handlers
│   │   ├── admin.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── course.controller.ts
│   │   └── student.controller.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── error-handler.ts
│   ├── models/              # Mongoose schemas
│   │   ├── Assignment.ts
│   │   ├── Course.ts
│   │   ├── Enrollment.ts
│   │   ├── Progress.ts
│   │   ├── Quiz.ts
│   │   └── User.ts
│   ├── routes/              # API routes
│   │   ├── admin.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── courses.routes.ts
│   │   └── student.routes.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── course.service.ts
│   │   └── student.service.ts
│   ├── scripts/             # Utility scripts
│   │   ├── admin-seeder.ts
│   │   └── update-course-videos.ts
│   ├── utils/               # Helper functions
│   │   ├── helpers.ts
│   │   └── validation.ts
│   └── index.ts             # Entry point
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
├── README.md
└── API_TESTING.md
```

### Frontend Structure
```
course-master-frontend/
├── app/                     # Next.js App Router
│   ├── admin/               # Admin pages
│   │   ├── analytics/
│   │   ├── assignments/
│   │   ├── courses/
│   │   ├── dashboard/
│   │   ├── enrollments/
│   │   ├── materials/
│   │   └── layout.tsx
│   ├── courses/             # Public course pages
│   │   ├── [id]/
│   │   └── page.tsx
│   ├── dashboard/           # Student dashboard
│   │   ├── courses/
│   │   ├── learn/[id]/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/
│   ├── register/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── shared/              # Shared components
│   ├── AdminSidebar.tsx
│   ├── AnalyticsChart.tsx
│   ├── CourseCard.tsx
│   ├── EmptyState.tsx
│   ├── LoadingSpinner.tsx
│   ├── Navbar.tsx
│   ├── ProgressBar.tsx
│   └── StudentSidebar.tsx
├── contexts/                # React Context
│   ├── AuthContext.tsx
│   └── CourseContext.tsx
├── hooks/                   # Custom hooks
│   └── use-mobile.tsx
├── lib/                     # Utilities
│   ├── api.ts               # Axios config
│   ├── tokenStorage.ts      # Token management
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Helper functions
├── services/                # API services
│   ├── admin.service.ts
│   ├── auth.service.ts
│   ├── course.service.ts
│   └── student.service.ts
├── public/                  # Static assets
├── .env.local               # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Database Schema

### User Model
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'student' | 'admin'
  enrolledCourses: ObjectId[]
  progress: [{
    courseId: ObjectId
    lessonsCompleted: number
    totalLessons: number
    percentage: number
  }]
  createdAt: Date
  updatedAt: Date
}
```

### Course Model
```typescript
{
  title: string
  description: string
  instructor: ObjectId (User)
  price: number
  category: string
  tags: string[]
  syllabus: [{
    lessonId: string
    title: string
    duration: number
    videoUrl: string
    description: string
  }]
  batches: [{
    batchId: string
    startDate: Date
    endDate: Date
    capacity: number
    enrolledCount: number
  }]
  enrollmentCount: number
  createdAt: Date
  updatedAt: Date
}
```

### Enrollment Model
```typescript
{
  courseId: ObjectId
  studentId: ObjectId
  batchId: string
  enrolledAt: Date
  completedAt?: Date
  status: 'active' | 'completed' | 'dropped'
}
```

### Progress Model
```typescript
{
  studentId: ObjectId
  courseId: ObjectId
  lessonsCompleted: number
  totalLessons: number
  percentage: number
  completedLessonIds: string[]
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Assignment Model
```typescript
{
  courseId: ObjectId
  lessonId: string
  title: string
  description: string
  dueDate: Date
  maxScore: number
  submissions: [{
    studentId: ObjectId
    submissionText?: string
    submissionLink?: string
    submittedAt: Date
    score?: number
    feedback?: string
    gradedAt?: Date
  }]
  createdAt: Date
  updatedAt: Date
}
```

### Quiz Model
```typescript
{
  courseId: ObjectId
  lessonId: string
  title: string
  description: string
  questions: [{
    questionText: string
    options: [{
      text: string
      isCorrect: boolean
    }]
    explanation: string
  }]
  passingScore: number
  attempts: [{
    studentId: ObjectId
    answers: number[]
    score: number
    attemptedAt: Date
    timeTaken: number
  }]
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /me` - Get current user

### Course Routes (`/api/courses`)
**Public:**
- `GET /` - Get all courses (with filters)
- `GET /:id` - Get course by ID

**Admin:**
- `POST /admin/create` - Create course
- `PUT /admin/:id` - Update course
- `DELETE /admin/:id` - Delete course

### Student Routes (`/api/student`)
- `POST /enroll` - Enroll in course
- `GET /courses` - Get enrolled courses
- `GET /materials` - Get lesson materials
- `POST /progress` - Update progress
- `POST /assignments` - Submit assignment
- `POST /quiz/submit` - Submit quiz

### Admin Routes (`/api/admin`)
- `GET /stats` - Dashboard statistics
- `GET /users` - Get all users
- `GET /enrollments` - Get all enrollments
- `GET /submissions` - Get all submissions
- `GET /quizzes/attempts` - Get quiz attempts
- `POST /grade` - Grade assignment
- `POST /assignments` - Create assignment
- `POST /quizzes` - Create quiz
- `GET /assignments/:courseId/:lessonId` - Get assignments by lesson
- `GET /quizzes/:courseId/:lessonId` - Get quizzes by lesson

---

## 🔐 Authentication Flow

### Current Implementation (Bearer Token)

1. **Registration/Login:**
   - User submits credentials
   - Backend validates and creates JWT token
   - Token returned in response body
   - Frontend stores token in localStorage
   - User object stored in AuthContext

2. **Authenticated Requests:**
   - Axios interceptor adds `Authorization: Bearer <token>` header
   - Backend middleware verifies token
   - User info attached to request object

3. **Auto-Logout:**
   - 401 response triggers token removal
   - User redirected to login page
   - Token cleared from localStorage

4. **Token Persistence:**
   - Token stored in localStorage
   - Checked on app mount
   - `/auth/me` endpoint validates token

---

## ✨ Key Features

### Student Features
- **Course Browsing**: Search, filter, and sort courses
- **Course Enrollment**: Select batch and enroll
- **Dashboard**: View enrolled courses with progress
- **Learning Page**: Watch videos, track lessons
- **Progress Tracking**: Visual progress bars
- **Assignments**: Submit text or link submissions
- **Quizzes**: Take quizzes with auto-grading
- **Materials**: Access assignments and quizzes per lesson

### Admin Features
- **Dashboard**: Statistics overview with key metrics
- **Analytics Dashboard**: Visual enrollment trends with interactive charts
- **Course Management**: CRUD operations
- **Syllabus Builder**: Dynamic lesson management
- **Batch Management**: Configure course batches
- **Assignment Creation**: Create assignments per lesson
- **Quiz Creation**: Create quizzes with multiple choice
- **Grading**: Grade student submissions
- **User Management**: View all users
- **Enrollment Tracking**: Monitor enrollments

### Common Features
- **Role-based Access Control**: Student/Admin separation
- **Responsive Design**: Mobile-first approach
- **Protected Routes**: Authentication required
- **Error Handling**: Global error handling
- **Loading States**: Spinner components
- **Empty States**: User-friendly empty views

---

## 🎨 Frontend Pages

### Public Pages
- `/` - Landing page with features
- `/courses` - Browse all courses
- `/courses/[id]` - Course details
- `/login` - User login
- `/register` - User registration

### Student Pages (Protected)
- `/dashboard` - Enrolled courses
- `/dashboard/courses` - My courses
- `/dashboard/learn/[id]` - Learning page

### Admin Pages (Protected)
- `/admin/dashboard` - Admin overview
- `/admin/analytics` - Analytics dashboard with enrollment charts
- `/admin/courses` - Manage courses
- `/admin/courses/create` - Create course
- `/admin/courses/edit/[id]` - Edit course
- `/admin/materials` - Manage materials
- `/admin/assignments` - View submissions
- `/admin/enrollments` - View enrollments

---

## 🚀 Running the Project

### Backend
```bash
cd course-master-backend
pnpm install
cp .env.example .env
# Configure .env
pnpm run dev  # Development
pnpm run build && pnpm start  # Production
```

### Frontend
```bash
cd course-master-frontend
pnpm install
# Configure .env.local
pnpm run dev  # Development
pnpm run build && pnpm start  # Production
```

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/coursemaster
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=13
ADMIN_EMAIL=admin@coursemaster.com
ADMIN_PASSWORD=Admin@123
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🔧 Key Technical Decisions

### 1. **Bearer Token Authentication**
- Migrated from HTTP-only cookies to Bearer tokens
- Tokens stored in localStorage for persistence
- Axios interceptors handle token injection
- Auto-logout on 401 responses

### 2. **Next.js App Router**
- Modern Next.js 16 with App Router
- Server and client components
- File-based routing
- Layout nesting

### 3. **Context API for State**
- AuthContext for user state
- CourseContext for course data
- No Redux needed for this scale

### 4. **Tailwind CSS v4**
- Utility-first styling
- Custom design tokens
- Responsive design
- Dark mode ready

### 5. **TypeScript Throughout**
- Full type safety
- Shared types between services
- Better developer experience
- Reduced runtime errors

### 6. **Service Layer Pattern**
- Separation of concerns
- Reusable API calls
- Centralized error handling
- Easy testing

---

## 📊 Current Status

### Completed Features
✅ User authentication (register, login, logout)
✅ JWT Bearer token implementation
✅ Course CRUD operations
✅ Course browsing with filters
✅ Student enrollment
✅ Progress tracking
✅ Assignment submission
✅ Quiz submission with auto-grading
✅ Admin dashboard with statistics
✅ Analytics dashboard with enrollment trends
✅ Interactive data visualization (Recharts)
✅ Material management (assignments/quizzes)
✅ Responsive UI design
✅ Role-based access control
✅ Protected routes
✅ Error handling
✅ Loading states

### Known Issues
- PowerShell execution policy may block package installation
- CORS configuration for production deployment
- Environment variable security considerations

---

## 🔒 Security Features

1. **Password Security**: bcrypt hashing with configurable salt rounds
2. **JWT Tokens**: Secure token generation with expiration
3. **Role-based Access**: Middleware for admin/student separation
4. **Input Validation**: Zod schemas for all inputs
5. **Error Handling**: Sanitized error messages
6. **CORS**: Configured for specific origins
7. **MongoDB Indexes**: Optimized queries with indexes

---

## 📝 API Documentation

Full API documentation available in:
- `course-master-backend/README.md` - Comprehensive API docs
- `course-master-backend/API_TESTING.md` - cURL examples and Postman guide

---

## 🎯 Future Enhancements

Potential improvements:
- Real-time notifications
- Video upload functionality
- Certificate generation
- Payment integration
- Discussion forums
- Live classes
- Mobile app
- Advanced analytics (student performance, course completion rates)
- Email notifications
- Social authentication
- Export analytics data (CSV, PDF)
- Custom date range filtering for analytics

---

## 📦 Deployment

### Backend Deployment (Vercel)
- Configured with `vercel.json`
- Environment variables in Vercel dashboard
- MongoDB Atlas for production database

### Frontend Deployment (Vercel)
- Automatic deployment from Git
- Environment variables configured
- API URL points to production backend

---

## 👥 Project Created By
Md Morshed Alam Mamun
---

## 📄 License

ISC

---

**Last Updated**: December 2025
