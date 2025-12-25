# Flowva Rewards Hub

A rewards and loyalty dashboard built with **React** and **Supabase**, inspired by Flowva’s rewards experience.  
Users can earn points through daily check-ins, track streaks, and redeem rewards once unlocked.

---

## 🔗 Live Demo
 **Live URL:** *[https://flowva-rewards-nine.vercel.app/]*

---

##  Tech Stack

- **Frontend:** React (Vite)
- **Backend & Database:** Supabase
- **Authentication:** Supabase Auth
- **Styling:** Custom CSS (mobile-first, responsive)
- **Icons:** Lucide React

---

##  Features

- User authentication (login & signup)
- Auto-created user profiles on first login
- Daily check-in system with streak tracking
- Points accumulation and progress tracking
- Rewards list fetched from database
- Locked / unlocked rewards logic
- Reward redemption with points deduction
- Responsive, mobile-first UI inspired by Flowva

---

##  Database Structure (Supabase)

**Tables used:**
- `profiles`
  - `id`
  - `email`
  - `points`
  - `daily_streak`
  - `last_check_in`
- `rewards`
  - `id`
  - `title`
  - `description`
  - `points_required`
  - `coming_soon`
- `redemptions`
  - `id`
  - `user_id`
  - `reward_id`
  - `created_at`

All authentication, reads, and writes are handled directly via Supabase.

---

## ⚙️ Setup Instructions

### 1️ Clone the repository
```bash
git clone https://github.com/rahmsey/flowwa-rewards.git
cd rewards-hub
```
### 2 Install dependencies
```bash
npm install
```
### 3 Set up environment variables
  Create a .env file in the project root and add the following
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
### 4 Set up environment variables
 Run the app locally
```bash
 npm run dev
```
