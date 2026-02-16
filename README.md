# Smart Bookmark App

Smart Bookmark App is a modern, real-time bookmark manager built with **Next.js 16** (App Router), **Tailwind CSS v4**, and **Supabase**. It allows users to securely save and organize their favorite links, sync them across devices instantly, and access them via a beautiful glassmorphism interface.
🌐 **Live Demo:** [https://smartbooker.com ](https://smart-marks.vercel.app/)

## 🚀 Key Features

*   **Google OAuth Authentication**: Secure, passwordless login with one click.
*   **Real-time Sync**: Bookmarks update instantly across all open tabs and devices without refreshing.
*   **Search & Filter**: Instantly filter your collection by title or URL.
*   **Auto Favicons**: Automatically fetches and displays website icons using Google's Favicon API.
*   **Clipboard Integration**: One-click copy for bookmark URLs.
*   **User Privacy**: Row Level Security (RLS) ensures only YOU can see your data.
*   **Responsive Design**: Fully responsive UI with a premium dark mode aesthetic.

---

## 🛠 Tech Stack

*   **Frontend**: Next.js 16 (App Router), React 19
*   **Styling**: Tailwind CSS v4, CSS Modules (Glassmorphism)
*   **Backend**: Supabase (PostgreSQL Database, Auth, Realtime)
*   **Deployment**: Vercel ready

---

## 🛑 Challenges Faced & Solutions

Building a real-time application with the latest Next.js features presented several challenges. Here is a breakdown of the problems encountered and how they were solved.

### 1. Hydration Mismatch Errors
**Problem:**
When rendering the bookmark creation date, we encountered a React Hydration Error: `Text content does not match server-rendered HTML`.
This happened because the server (Node.js) and the client (Browser) had different default locale settings for `Date.toLocaleDateString()`. The server rendered "Feb 16, 2026", while the client rendered "16 Feb 2026".

**Solution:**
We explicitly set the locale to `'en-US'` in the `toLocaleDateString` method to ensure consistent formatting across all environments.
```javascript
// Before (Error)
new Date(date).toLocaleDateString() 

// After (Fixed)
new Date(date).toLocaleDateString('en-US', { ...options })
```

### 2. Missing Data on Refresh (RLS Policy Issue)
**Problem:**
Users could add bookmarks successfully, but upon refreshing the page, the list would be empty. The data was in the database, but the application couldn't read it back.

**Solution:**
This was caused by Supabase's **Row Level Security (RLS)** being enabled but lacking a `SELECT` policy. We implemented a strict policy that only allows users to select rows where their `user_id` matches the authenticated user's ID.
```sql
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);
```

### 3. Turbopack on Windows
**Problem:**
During development, `npm run dev` failed with an error: `turbo.createProject is not supported by the wasm bindings`. This was due to a corrupted or incompatible binary for the SWC compiler on the Windows environment.

**Solution:**
We performed a clean re-installation of the project dependencies:
1. Deleted `node_modules`, `.next`, and `package-lock.json`.
2. Ran `npm install` to fetch fresh, compatible binaries.

### 4. Middleware & Request Proxying
**Problem:**
The authentication flow required refreshing the user session on every request to keep the auth cookie valid. The newer Next.js middleware conventions discourage direct response manipulation in certain ways.

**Solution:**
We implemented a dedicated Supabase middleware helper (`updateSession`) that properly handles the request/response cycle, ensuring cookies are set correctly for server-side rendering (SSR) compatibility.

---

## 🏁 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment Variables**:
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

