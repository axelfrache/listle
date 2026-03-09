import { categories, dashboardData, leaderboardData } from "@/mocks/data"
import type {
  Category,
  DashboardData,
  GameResult,
  LeaderboardEntry,
  LeaderboardWindow,
  UserProfile,
  UserStats,
  WordSubmissionResult,
} from "@/types/models"

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

const normalizeWord = (word: string) => word.trim().toLowerCase()

export async function fetchDashboardData(): Promise<DashboardData> {
  await wait(450)
  return dashboardData
}

export async function fetchDailyCategory(): Promise<Category> {
  await wait(300)
  return categories[0]
}

export async function fetchLeaderboard(
  window: LeaderboardWindow,
): Promise<LeaderboardEntry[]> {
  await wait(420)
  return leaderboardData[window]
}

export async function fetchUserStats(): Promise<UserStats> {
  await wait(380)
  return dashboardData.stats
}

export async function fetchUserProfile(): Promise<UserProfile> {
  await wait(320)
  return dashboardData.profile
}

export async function submitWord(
  category: Category,
  existingWords: string[],
  rawWord: string,
): Promise<WordSubmissionResult> {
  await wait(120)
  const normalized = normalizeWord(rawWord)

  if (!normalized || !/^[a-z][a-z\s-]*$/.test(normalized)) {
    return { status: "invalid", normalized, scoreDelta: 0 }
  }

  if (existingWords.includes(normalized)) {
    return { status: "duplicate", normalized, scoreDelta: 0 }
  }

  if (!category.words.includes(normalized)) {
    return { status: "invalid", normalized, scoreDelta: 0 }
  }

  return { status: "valid", normalized, scoreDelta: 1 }
}

export async function finalizeGame(words: string[]): Promise<GameResult> {
  await wait(350)
  return {
    score: words.length,
    words,
    bestScore: Math.max(words.length, dashboardData.snapshot.userBestScore),
    streak: dashboardData.snapshot.userStreak + 1,
    percentile: Math.min(99, 58 + words.length * 2),
  }
}
