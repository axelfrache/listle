export type LeaderboardWindow = "daily" | "weekly" | "global"

export type GameFeedbackState = "idle" | "valid" | "duplicate" | "invalid"

export type WordSubmissionStatus = "valid" | "duplicate" | "invalid"

export interface Category {
  id: string
  name: string
  description: string
  accent: string
  words: string[]
}

export interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  streak: number
  isCurrentUser?: boolean
}

export interface StatPoint {
  label: string
  value: number
}

export interface CategoryPerformance {
  category: string
  averageScore: number
  bestScore: number
}

export interface RecentGame {
  date: string
  category: string
  score: number
  percentile: number
}

export interface UserStats {
  averageScore: number
  bestScore: number
  gamesPlayed: number
  currentStreak: number
  totalWordsFound: number
  strongestCategories: CategoryPerformance[]
  recentHistory: RecentGame[]
  weeklyTrend: StatPoint[]
}

export interface Achievement {
  id: string
  label: string
  description: string
}

export interface UserProfile {
  username: string
  joinedAt: string
  tagline: string
  avatarLetters: string
  badges: Achievement[]
  stats: Pick<
    UserStats,
    "averageScore" | "bestScore" | "gamesPlayed" | "currentStreak"
  >
}

export interface DailySnapshot {
  date: string
  category: Category
  userBestScore: number
  userStreak: number
  leaderboardPreview: LeaderboardEntry[]
}

export interface DashboardData {
  snapshot: DailySnapshot
  stats: UserStats
  profile: UserProfile
}

export interface GameWord {
  value: string
  status: Extract<WordSubmissionStatus, "valid" | "duplicate">
}

export interface GameResult {
  score: number
  words: string[]
  bestScore: number
  streak: number
  percentile: number
}

export interface WordSubmissionResult {
  status: WordSubmissionStatus
  normalized: string
  scoreDelta: number
}
