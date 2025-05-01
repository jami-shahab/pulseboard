# Pulseboard - Real-time Open Source Health Dashboard
Note: This project is still in development. 


https://www.loom.com/share/32b6fe78d3e54126a3a3db9f09da2462?sid=e129abc3-a41a-4458-9155-d5b52a6069fa 


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_GITHUB_USERNAME%2Fpulseboard&env=GITHUB_PAT,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET,NEXTAUTH_SECRET,NEXTAUTH_URL,NEXT_PUBLIC_GITHUB_GRAPHQL_ENDPOINT&envDescription=Required%20environment%20variables%20for%20Pulseboard&project-name=pulseboard&repository-name=pulseboard)

Pulseboard is a real-time, open-source health dashboard that pulls live data from the GitHub GraphQL API to monitor the pulse of public (and private, if authenticated) repositories.

![Pulseboard Screenshot](public/pulseboard-screenshot-placeholder.png) <!-- TODO: Add an actual screenshot -->

## ✨ Features

*   **Live OSS Pulse:** View lists of recent commits, issues, and pull requests for any public repo (requires configuration).
*   **Real-time Updates (Planned):** Data intended to update in real-time using subscriptions or polling (implementation pending).
*   **Health Metrics:** Visualize contributor activity (heatmap), issue velocity (open/closed trends), and release cadence.
*   **Contributors Leaderboard:** See top contributors based on recent commit activity.
*   **GitHub Authentication:** Log in with GitHub ("Login with GitHub") to view metrics for your private repositories.
*   **Stack Visualizer:** A dedicated page (`/stack`) showing the core technologies and architecture used by Pulseboard itself.
*   **One-Command Deploy:** Easily deploy your own instance using the Vercel button above.

## 🛠️ Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router, RSC, API Routes)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **API:** [GitHub GraphQL API (v4)](https://docs.github.com/en/graphql)
*   **Data Fetching:** [Apollo Client](https://www.apollographql.com/docs/react/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
*   **Visualizations:** [Recharts](https://recharts.org/), [React Calendar Heatmap](https://github.com/patientslikeme/react-calendar-heatmap)
*   **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/pulseboard.git
cd pulseboard
```

*(Replace `YOUR_GITHUB_USERNAME` with your actual username if you forked the repo)*

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Pulseboard requires several environment variables to connect to the GitHub API and handle authentication. Create a file named `.env.local` in the root of the project and add the following variables:

```dotenv
# GitHub Personal Access Token (Classic) for server-side API calls
# Scope needed: public_repo (for public data)
# Generate one: https://github.com/settings/tokens
GITHUB_PAT="ghp_YOUR_PAT_HERE"

# GitHub OAuth App Credentials for user login
# Create an app: https://github.com/settings/developers
# Homepage URL: http://localhost:3000
# Authorization callback URL: http://localhost:3000/api/auth/callback/github
GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID"
GITHUB_CLIENT_SECRET="YOUR_GITHUB_CLIENT_SECRET"

# Secret for NextAuth.js session encryption
# Generate a strong secret, e.g., openssl rand -base64 32
NEXTAUTH_SECRET="YOUR_SUPER_SECRET_STRING_FOR_NEXTAUTH"

# Base URL for NextAuth (important for redirects)
NEXTAUTH_URL="http://localhost:3000"

# Public GitHub GraphQL Endpoint (should not need changing)
NEXT_PUBLIC_GITHUB_GRAPHQL_ENDPOINT="https://api.github.com/graphql"
```

**Important Notes:**

*   Obtain your `GITHUB_PAT`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET` from GitHub as described in the comments.
*   Generate a secure random string for `NEXTAUTH_SECRET`.
*   The `.env.local` file is included in `.gitignore` and should **never** be committed to version control.
*   You can use the `.env.example` file as a template.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## ☁️ Deployment

The easiest way to deploy Pulseboard is using [Vercel](https://vercel.com/).

1.  **Push to GitHub:** Ensure your code (including your `.gitignore` but **not** `.env.local`) is pushed to a GitHub repository.
2.  **Click the Deploy Button:** Click the "Deploy with Vercel" button at the top of this README.
    *   You will be prompted to clone the repository to your GitHub account if you haven't already.
    *   Vercel will automatically detect the Next.js project.
3.  **Configure Environment Variables:** During the Vercel setup process, you will be asked to provide the environment variables listed in the `.env.local` section above. **Crucially, update `NEXTAUTH_URL`** to your production deployment URL provided by Vercel (e.g., `https://your-project-name.vercel.app`). You also need to update the **Homepage URL** and **Authorization callback URL** in your GitHub OAuth App settings to match your Vercel deployment URL.
4.  **Deploy:** Vercel will build and deploy your application.

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## 📄 License

This project is open-source, licensed under the MIT License. (Consider adding a LICENSE file).
