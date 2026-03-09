import { type FormEvent, useEffect, useRef, useState } from "react"
import { Timer } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Loader } from "@/components/ui/Loader"
import { Modal } from "@/components/ui/Modal"
import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchDailyCategory, finalizeGame, startGame, submitWord } from "@/lib/api"
import { Dialog } from "@/components/retroui/Dialog"

import type { GameFeedbackState, GameResult, GameWord } from "@/types/models"

type GameState = "pre-game" | "active" | "finished"

const ROUND_SECONDS = 60

export function PlayPage() {
  const navigate = useNavigate()
  const { data: category, loading, error } = useAsyncData(fetchDailyCategory, [])
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [input, setInput] = useState("")
  const [words, setWords] = useState<GameWord[]>([])
  const [gameState, setGameState] = useState<GameState>("pre-game")
  const [feedback, setFeedback] = useState<{ state: GameFeedbackState; label: string }>({
    state: "idle",
    label: "Commence à taper avant la fin du chrono.",
  })
  const [result, setResult] = useState<GameResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [starting, setStarting] = useState(false)
  const [gameId, setGameId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!category || gameState !== "active") {
      return
    }

    if (timeLeft <= 0 && gameId) {
      setGameState("finished")
      finalizeGame(
        gameId,
        words.filter((word) => word.status === "valid").map((word) => word.value),
      ).then(setResult)
      return
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [category, gameId, gameState, timeLeft, words])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-2 border-black bg-white px-6 py-4 text-black shadow-[6px_6px_0_0_#000]">
          Impossible de charger la catégorie du jour.
        </div>
      </div>
    )
  }

  const validWords = words.filter((word) => word.status === "valid")
  const urgency = timeLeft <= 10

  async function handleStartGame() {
    setStarting(true)
    try {
      const session = await startGame()
      setGameId(session.gameId)
      setGameState("active")
      window.requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    } catch {
      setFeedback({ state: "invalid", label: "Impossible de démarrer la session de jeu." })
    } finally {
      setStarting(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!input.trim() || gameState !== "active" || !gameId) {
      return
    }

    setSubmitting(true)
    let submission
    try {
      submission = await submitWord(gameId, input, validWords.map((word) => word.value))
    } catch {
      setFeedback({ state: "invalid", label: "Envoi échoué. Réessaie." })
      setSubmitting(false)
      return
    }

    if (submission.status === "valid") {
      setWords((current) => [
        { value: submission.normalized, status: "valid" },
        ...current,
      ])
      setFeedback({ state: "valid", label: `+1 point. ${submission.normalized} accepté.` })
    } else if (submission.status === "duplicate") {
      setWords((current) => [
        { value: submission.normalized || input.trim().toLowerCase(), status: "duplicate" },
        ...current,
      ])
      setFeedback({ state: "duplicate", label: `${submission.normalized} déjà proposé.` })
    } else {
      setFeedback({ state: "invalid", label: `"${input.trim()}" n'est pas valide ici.` })
    }

    setInput("")
    setSubmitting(false)
    window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }

  function handleReset() {
    setTimeLeft(ROUND_SECONDS)
    setWords([])
    setInput("")
    setResult(null)
    setGameId(null)
    setGameState("pre-game")
    setFeedback({ state: "idle", label: "Nouvelle manche. Fais durer ta série." })
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl">
        <section className="space-y-6">
          <Card className="w-full border-black bg-[#fff7d6] shadow-[8px_8px_0_0_#000] sm:shadow-[12px_12px_0_0_#000]">
            <Card.Content className="space-y-6 p-4 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="space-y-3">
                  <Badge tone="accent">Catégorie du jour</Badge>
                  <div>
                    <h1 className="font-head text-3xl uppercase leading-none tracking-[0.08em] text-black sm:text-5xl sm:tracking-[0.12em]">
                      {category.name}
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-black/70">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div
                  className={`self-start border-2 border-black px-5 py-3 text-center shadow-[6px_6px_0_0_#000] sm:self-auto sm:px-6 sm:py-4 sm:shadow-[8px_8px_0_0_#000] ${urgency ? "bg-[#ff7a59] text-black" : "bg-white text-black"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
                    <Timer className="size-4" />
                    Chrono
                  </div>
                  <div className="mt-2 font-head text-4xl uppercase sm:text-5xl">{timeLeft}</div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={gameState === "pre-game" ? "En attente du démarrage..." : "Saisis un mot et valide avec Entrée"}
                  autoFocus={gameState === "active"}
                  disabled={gameState !== "active" || submitting}
                  className="h-14 text-base font-bold uppercase tracking-[0.06em] sm:h-16 sm:text-lg sm:tracking-[0.08em]"
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div
                    className={`w-full border-2 border-black px-4 py-3 text-sm font-bold shadow-[6px_6px_0_0_#000] sm:w-auto ${feedback.state === "valid"
                      ? "bg-[#68f2a3] text-black"
                      : feedback.state === "duplicate"
                        ? "bg-[#ffe45e] text-black"
                        : feedback.state === "invalid"
                          ? "bg-[#ff7a59] text-black"
                          : "bg-white text-black"
                      }`}
                  >
                    {feedback.label}
                  </div>
                  <Button size="lg" className="w-full sm:w-auto" disabled={gameState !== "active" || submitting}>
                    Valider le mot
                  </Button>
                </div>
              </form>

              <div className="grid gap-4 sm:grid-cols-[0.35fr_1fr]">
                <div className="border-2 border-black bg-[#10131d] p-5 text-white shadow-[8px_8px_0_0_#000]">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                    Score
                  </div>
                  <div className="mt-3 font-head text-5xl uppercase sm:text-6xl">{validWords.length}</div>
                </div>
                <div className="border-2 border-black bg-white p-4 shadow-[8px_8px_0_0_#000]">
                  <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-black/60">
                    Mots capturés
                  </div>
                  <div className="flex min-h-24 flex-wrap gap-3">
                    {words.length === 0 ? (
                      <div className="text-sm text-black/60">
                        Aucun mot pour l'instant. Le tableau se remplit dès la première réponse.
                      </div>
                    ) : (
                      words.map((word, index) => (
                        <div
                          key={`${word.value}-${index}`}
                          className={`border-2 border-black px-3 py-2 text-xs font-black uppercase tracking-[0.1em] shadow-[4px_4px_0_0_#000] sm:text-sm sm:tracking-[0.14em] ${word.status === "valid"
                            ? "bg-[#68f2a3] text-black"
                            : "bg-[#ffe45e] text-black"
                            }`}
                        >
                          {word.value}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </section>
      </div>

      <Dialog open={gameState === "pre-game"}>
        <Dialog.Content className="w-[min(94vw,680px)] border-black bg-[#fff7d6] p-0">
          <Dialog.Header className="border-black bg-[#ffe45e] px-5 py-4 sm:px-8 sm:py-5">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-black/60">
              Prêt ?
            </div>
            <div className="font-head text-3xl uppercase leading-none text-black sm:text-5xl">
              {category.name}
            </div>
            <Dialog.Description className="mt-3 max-w-[36ch] text-sm font-bold text-black/80 sm:text-base">
              Saisis un maximum de {category.name.toLowerCase()} en 60 secondes. 1 point par mot valide.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer className="border-black bg-[#fff7d6] px-5 py-4 sm:px-8 sm:py-5" position="static">
            <Button size="lg" className="w-full sm:w-auto" onClick={handleStartGame} disabled={starting}>
              Lancer la manche du jour
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      <Modal
        open={gameState === "finished"}
        title={`Tu as marqué ${result?.score ?? 0}`}
        description="Manche terminée. Voici un résumé clair de ta partie."
        actionLabel="Rejouer"
        onAction={handleReset}
        secondaryActionLabel="Retour à l'accueil"
        onSecondaryAction={() => navigate("/")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
              Score
            </div>
            <div className="mt-2 font-head text-4xl uppercase text-black">
              {result?.score ?? 0}
            </div>
          </div>
          <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
              Meilleur score
            </div>
            <div className="mt-2 font-head text-4xl uppercase text-black">
              {result?.bestScore ?? 0}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
            Mots valides
          </div>
          <div className="flex flex-wrap gap-3">
            {result?.words.map((word) => (
              <div
                key={word}
                className="border-2 border-black bg-[#68f2a3] px-3 py-2 text-sm font-black uppercase tracking-[0.14em] text-black shadow-[4px_4px_0_0_#000]"
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}
