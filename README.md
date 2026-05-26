# Who's In Town - Artist & Event Discovery

A modern, responsive React application built as a frontend technical assessment. This project allows users to search for musical artists, view their upcoming tour dates, manage favorite events, and customize their experience through persistent settings.

## 🚀 Tech Stack

- **Framework:** [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Data Fetching:** [TanStack Query (React Query) v5](https://tanstack.com/query/latest)
- **Internationalization:** [i18next](https://www.i18next.com/) (EN/DE support)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Context API + Custom Mediator Hook Pattern
- **Deployment:** Configured for [Firebase Hosting](https://firebase.google.com/docs/hosting) via GitHub Actions

## 🏛️ Architecture

The project follows a modular and service-oriented architecture designed for scalability and separation of concerns:

### 1. Component-Driven UI
The interface is broken down into atomic components (e.g., `SearchBar`, `FavoriteItem`) and complex organisms (`SelectedEventPanel`, `FavoritesPanel`). This ensures high reusability and easier testing.

### 2. State & Data Management
- **Context Providers:** Centralized logic for `User`, `Favorites`, and `Theme` using React Context.
- **Mediator Pattern:** Implementation of a `useMediatorState` hook to synchronize complex state transitions between the UI and the Context providers.
- **Server State:** TanStack Query (v5) manages asynchronous artist and event data. It implements a centralized retry policy and intelligent caching to minimize redundant API calls.
- **Session Management Hook (`useSession`):** A custom hook that orchestrates authentication state. It handles session hydration on mount, clean logout procedures, and active lifecycle monitoring.

### 3. Service Layer
- **Persistence Strategy:** 
    - **`CookieService`:** Used exclusively for active session management. It utilizes **Base64 encoding** for both keys and values to provide basic obfuscation and session isolation. 
    - **`UserStorageService`:** Acts as a mock backend using `localStorage`. It manages a persistent user database, handling registration, credential verification, and long-term storage of user profiles and settings.
- **API Service Layer:** All external fetches (Bandsintown API) are encapsulated in dedicated service modules. This decouples the network logic from React components, making the data layer easily testable and swappable.

### 4. Internationalization (i18n)
Full support for multi-language switching (English and German) with persistent language preferences that sync to the user's profile.

## ✨ Features

### 🔍 Artist & Event Search
- Dynamic search for artists with integrated clear functionality.
- Detailed event cards showing venue names, locations, and interactive maps/links.
- Integrated ticket offers with direct external links.

### ⭐ Favorites System
- Users can "star" events to save them.
- **Logged-out users:** Favorites are transient and kept in local state.
- **Logged-in users:** Favorites are automatically persisted to the user's profile in the mock backend (`localStorage`), surviving page refreshes and re-logins.

### 🌗 Theming & Responsive Design
- **Adaptive Layout:** A 3-column grid that intelligently refactors based on screen size.
- **Favorites Drawer:** On tablets and mobile, the Favorites panel transforms into a sleek, fixed-position drawer with a vertical "peek" handle to maximize screen real estate.
- **Dark Mode:** System-aware theme toggle with manual override and persistence.

### 🔐 Auth Simulation
- Full registration and login flow.
- **Session Watchdog:** The application includes a background monitoring process that observes cookie expiration in real-time. If a session expires while the app is open, the user is automatically and gracefully logged out to maintain state integrity.
- Dynamic Header that adapts based on authentication status.

### 🍪 UX & Compliance
- **Cookie Consent:** A dedicated banner for GDPR compliance that persists once accepted.
- **Scroll Management:** Independent scrollable containers for results and event details, keeping the header and footer accessible.

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/web-dev-s/whos-in-town.git]
   cd whos-in-town
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 📦 Deployment

The project includes a `.github/workflows/firebase-hosting.yml` file for automated CI/CD. 

**To deploy manually:**
1. Build the project: `npm run build`
2. Deploy using Firebase CLI: `firebase deploy`

---
*Developed as a frontend technical assessment.*
