import type {
  AdminCategory,
  AdminScheduleItem,
  Category,
  CategorySyncResult,
  DashboardData,
  GameResult,
  LeaderboardEntry,
  LeaderboardWindow,
  UserProfile,
  UserStats,
  WordSubmissionResult,
} from "@/types/models"
import { getAuthToken, setAuthToken } from "@/lib/auth"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://localhost:8080/api/v1" : "/api/v1")

type AuthResponse = {
  token: string
  tokenType: string
}

type GameStartResponse = {
  gameId: string
  startedAt: string
}

type SubmissionResponse = {
  valid: boolean
  duplicate: boolean
  scoreDelta: number
  foundCount: number
}

type GameFinishResponse = {
  gameId: string
  finalScore: number
  foundCount: number
  bestScore: number
  currentStreak: number
  percentile: number
}

type MeStatsResponse = UserStats
type MeProfileResponse = UserProfile

async function requestJson<T>(path: string, init?: RequestInit, requiresAuth = false): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  }

  if (requiresAuth) {
    const token = getAuthToken()
    if (!token) {
      throw new Error("Non autorisé")
    }
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Non autorisé")
    }
    let message = `Échec de la requête (${response.status})`
    const raw = await response.text()
    if (raw) {
      try {
        const body = JSON.parse(raw) as { message?: string }
        if (typeof body.message === "string" && body.message.length > 0) {
          message = body.message
        }
      } catch {
        message = raw
      }
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export async function login(input: { username: string; password: string }) {
  const result = await requestJson<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  })
  setAuthToken(result.token)
}

export async function register(input: { username: string; email: string; password: string }) {
  const result = await requestJson<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  })
  setAuthToken(result.token)
}

export function fetchDashboardData(): Promise<DashboardData> {
  return requestJson<DashboardData>("/public/dashboard")
}

export function fetchDailyCategory(): Promise<Category> {
  return requestJson<Category>("/public/categories/daily")
}

export function fetchLeaderboard(window: LeaderboardWindow): Promise<LeaderboardEntry[]> {
  return requestJson<LeaderboardEntry[]>(`/public/leaderboard?window=${encodeURIComponent(window)}`)
}

export function fetchUserStats(): Promise<MeStatsResponse> {
  return requestJson<MeStatsResponse>("/me/stats", undefined, true)
}

export function fetchUserProfile(): Promise<MeProfileResponse> {
  return requestJson<MeProfileResponse>("/me/profile", undefined, true)
}

export async function updateUsername(username: string) {
  const result = await requestJson<AuthResponse>(
    "/me/username",
    { method: "PUT", body: JSON.stringify({ username }) },
    true,
  )
  setAuthToken(result.token)
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  await requestJson<void>(
    "/me/password",
    { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) },
    true,
  )
}

export function startGame(): Promise<GameStartResponse> {
  return requestJson<GameStartResponse>("/games", { method: "POST" }, true)
}

export function fetchAdminSchedule(days = 14): Promise<AdminScheduleItem[]> {
  return requestJson<AdminScheduleItem[]>(`/admin/schedule?days=${days}`, undefined, true)
}

export function fetchAdminCategories(): Promise<AdminCategory[]> {
  return requestJson<AdminCategory[]>("/admin/categories", undefined, true)
}

export function syncCategory(slug: string): Promise<CategorySyncResult> {
  return requestJson<CategorySyncResult>(
    `/admin/categories/${encodeURIComponent(slug)}/sync`,
    { method: "POST" },
    true,
  )
}

export function syncAllCategories(): Promise<{
  synced: number
  failed: number
  results: CategorySyncResult[]
}> {
  return requestJson("/admin/categories/sync-all", { method: "POST" }, true)
}

export async function submitWord(
  gameId: string,
  rawWord: string,
  existingWords: string[],
): Promise<WordSubmissionResult> {
  const normalized = rawWord.trim().toLowerCase()
  const result = await requestJson<SubmissionResponse>(
    `/games/${encodeURIComponent(gameId)}/submit`,
    {
      method: "POST",
      body: JSON.stringify({ word: rawWord }),
    },
    true,
  )

  if (!result.valid) {
    return { status: "invalid", normalized, scoreDelta: 0 }
  }
  if (result.duplicate || existingWords.includes(normalized)) {
    return { status: "duplicate", normalized, scoreDelta: 0 }
  }
  return { status: "valid", normalized, scoreDelta: result.scoreDelta }
}

export async function finalizeGame(gameId: string, words: string[]): Promise<GameResult> {
  const result = await requestJson<GameFinishResponse>(
    `/games/${encodeURIComponent(gameId)}/finish`,
    { method: "POST" },
    true,
  )

  return {
    score: result.finalScore,
    words,
    bestScore: result.bestScore,
    streak: result.currentStreak,
    percentile: result.percentile,
  }
}
