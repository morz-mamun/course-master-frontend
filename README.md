# Course Master Frontend

A modern, responsive Learning Management System (LMS) frontend built with Next.js 16, TypeScript, and Tailwind CSS.

## 🚀 Features

### Student Features
- **Course Browsing**: Search, filter, and sort courses by category, tags, and price
- **Course Details**: View comprehensive course information, syllabus, and available batches
- **Enrollment**: Enroll in courses and select preferred batches
- **Dashboard**: Track enrolled courses and learning progress
- **Progress Tracking**: Visual progress bars showing course completion

### Admin Features
- **Admin Dashboard**: Overview statistics and quick actions
- **Course Management**: Create, edit, and delete courses
- **Syllabus Builder**: Dynamic lesson management with video URLs
- **Batch Management**: Configure multiple course batches with dates and capacity

### Authentication
- **JWT Cookie-based Auth**: Secure HTTP-only cookie authentication
- **Role-based Access**: Separate interfaces for students and admins
- **Protected Routes**: Automatic redirection based on authentication status

## 📋 Prerequisites

- Node.js 16+ or higher
- npm, pnpm, or yarn
- Backend API running on `http://localhost:5000` (or configured URL)

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Install axios** (if not already installed due to PowerShell restrictions)
   ```bash
   # Run PowerShell as Administrator and execute:
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   
   # Then install axios:
   npm install axios
   ```

3. **Configure environment variables**
   
   The `.env.local` file should already exist with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
   
   Update the URL if your backend runs on a different port.

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
course-master-frontend/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin pages
│   │   ├── dashboard/            # Admin dashboard
│   │   └── courses/              # Course management
│   │       ├── page.tsx          # Courses list
│   │       ├── create/           # Create course
│   │       └── edit/[id]/        # Edit course
│   ├── courses/                  # Public course pages
│   │   ├── page.tsx              # Course listing
│   │   └── [id]/                 # Course details
│   ├── dashboard/                # Student dashboard
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Landing page
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── CourseCard.tsx            # Course display card
│   ├── ProgressBar.tsx           # Progress indicator
│   ├── Navbar.tsx                # Navigation bar
│   ├── LoadingSpinner.tsx        # Loading state
│   ├── EmptyState.tsx            # Empty state display
│   └── ProtectedRoute.tsx        # Route protection wrapper
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx           # Authentication state
│   └── CourseContext.tsx         # Course data state
├── services/                     # API service layer
│   ├── auth.service.ts           # Auth API calls
│   ├── course.service.ts         # Course API calls
│   └── student.service.ts        # Student API calls
├── lib/                          # Utilities
│   ├── api.ts                    # Axios configuration
│   ├── types.ts                  # TypeScript definitions
│   └── utils.ts                  # Helper functions
└── public/                       # Static assets
```

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## 🔐 Authentication Flow

1. User registers or logs in via `/register` or `/login`
2. Backend sets HTTP-only cookie with JWT token
3. Frontend automatically checks authentication on mount
4. Protected routes redirect based on user role:
   - Students → `/dashboard`
   - Admins → `/admin/dashboard`
   - Unauthenticated → `/login`

## 📱 Pages Overview

### Public Pages
- `/` - Landing page with features and CTAs
- `/courses` - Browse all courses with filters
- `/courses/[id]` - Course details and enrollment
- `/login` - User login
- `/register` - User registration

### Student Pages (Protected)
- `/dashboard` - Enrolled courses and progress

### Admin Pages (Protected)
- `/admin/dashboard` - Statistics and overview
- `/admin/courses` - Manage all courses
- `/admin/courses/create` - Create new course
- `/admin/courses/edit/[id]` - Edit existing course

## 🎯 Key Features Implementation

### Course Filtering
- Search by title/description
- Filter by category
- Sort by price (ascending/descending) or newest
- Pagination support

### Progress Tracking
- Visual progress bars
- Percentage calculation
- Lessons completed vs total lessons
- Color-coded progress indicators

### Responsive Design
- Mobile-first approach
- Collapsible mobile navigation
- Responsive grid layouts
- Touch-friendly interactions

## 🔧 Configuration

### API Base URL
Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to your backend:
```env
NEXT_PUBLIC_API_URL=http://your-backend-url:port
```

### Tailwind Configuration
Custom design tokens are defined in `app/globals.css` using CSS variables for easy theming.

## 🚦 Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Register new student account
   - [ ] Login with credentials
   - [ ] Logout functionality
   - [ ] Auto-redirect when authenticated

2. **Student Flow**
   - [ ] Browse courses
   - [ ] Search and filter courses
   - [ ] View course details
   - [ ] Enroll in a course
   - [ ] View dashboard with enrolled courses
   - [ ] See progress tracking

3. **Admin Flow**
   - [ ] Login as admin
   - [ ] View admin dashboard statistics
   - [ ] Create new course
   - [ ] Edit existing course
   - [ ] Delete course
   - [ ] Manage syllabus and batches

4. **Responsive Design**
   - [ ] Test on mobile (375px)
   - [ ] Test on tablet (768px)
   - [ ] Test on desktop (1920px)

## 🐛 Known Issues

- **PowerShell Execution Policy**: May need to adjust execution policy to install packages
- **Axios Installation**: Might require manual installation due to script restrictions

## 📝 Notes

- The frontend expects the backend to be running and accessible
- All API calls use cookie-based authentication
- The app uses Next.js App Router (not Pages Router)
- State management uses Context API (not Redux)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 👥 Authors

Course Master Development Team

---

**Happy Learning! 🎓**
