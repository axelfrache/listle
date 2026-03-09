import { BrowserRouter, Route, Routes } from "react-router-dom"

import { AuthPage } from "@/features/auth/AuthPage"
import { PlayPage } from "@/features/game/PlayPage"
import { LandingPage } from "@/features/landing/LandingPage"
import { LeaderboardPage } from "@/features/leaderboard/LeaderboardPage"
import { ProfilePage } from "@/features/profile/ProfilePage"
import { StatsPage } from "@/features/stats/StatsPage"
import { AppLayout } from "@/layouts/AppLayout"
import { ProtectedRoute } from "@/router/ProtectedRoute"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/play" element={<PlayPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
