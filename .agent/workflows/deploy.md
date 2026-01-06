---
description: How to deploy the Kondo application online
---

To put your app online, the most common and easiest path is using **Vercel** or **Netlify**. Since you are using Vite, the process is very straightforward.

### 1. Push your code to GitHub
If you haven't already, you need to put your code on a Git provider.
1. Create a new repository on [GitHub](https://github.com/new).
2. Run these commands in your project terminal:
   ```powershell
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 2. Deploy to Vercel (Recommended)
1. Go to [Vercel](https://vercel.com) and sign in with GitHub.
2. Click **"Add New"** > **"Project"**.
3. Import your `Kondo` repository.
4. **CRITICAL STEP**: Under **Environment Variables**, add the variables from your `.env` file:
   - `VITE_SUPABASE_URL`: (Your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
5. Click **Deploy**.

### 3. Update Supabase Redirect URLs
Since you are using Supabase Auth, you need to tell Supabase about your new online URL:
1. Go to your [Supabase Dashboard](https://app.supabase.com).
2. Navigate to **Authentication** > **URL Configuration**.
3. Add your Vercel URL (e.g., `https://kondo-app.vercel.app`) to the **Site URL** and **Redirect URLs**.

### Alternative: Netlify
The process for Netlify is identical:
1. Sign in to [Netlify](https://www.netlify.com).
2. **"Import from Git"**.
3. Select your repo.
4. Add the same Environment Variables in the "Site Configuration" > "Environment Variables" section.
5. Deploy.