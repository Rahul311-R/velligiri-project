# Velliangiri Hills Guide Booking

A full-stack booking website for Velliangiri Hills guides.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4, ShadCN UI
- **Database**: MongoDB with Mongoose
- **Calendar**: FullCalendar
- **Auth**: Custom JWT Auth (Lightweight)

## features

### Client Side
- Public booking form
- Date & Time slot selection
- Automatic validation (Zod)
- Mobile-responsive nature-themed design

### Admin Side (Secure)
- Login: `/admin/login`
- Dashboard: `/admin`
- Calendar View (Day/Week/Month)
- Booking Management (Approve/Reject/Delete)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Update `.env` with your MongoDB URI:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_PASSWORD=admin123
   JWT_SECRET=your_jwt_secret
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Admin Access
- URL: `/admin`
- Default Password: `admin123` (Change in .env)
