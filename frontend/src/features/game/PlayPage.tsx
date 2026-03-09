import { useEffect, useRef, useState } from "react"
import { Timer } from "lucide-react"

import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Loader } from "@/components/ui/Loader"
import { Modal } from "@/components/ui/Modal"
import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchDailyCategory, finalizeGame, submitWord } from "@/lib/mock-api"
import { Dialog } from "@/components/retroui/Dialog"

import type { GameFeedbackState, GameResult, GameWord } from "@/types/models"

type GameState = "pre-game" | "active" | "finished"

const ROUND_SECONDS = 60

export function PlayPage() {
  const { data: category, loading } = useAsyncData(fetchDailyCategory, [])
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [input, setInput] = useState("")
  const [words, setWords] = useState<GameWord[]>([])
  const [gameState, setGameState] = useState<GameState>("pre-game")
  const [feedback, setFeedback] = useState<{ state: GameFeedbackState; label: string }>({
    state: "idle",
    label: "Start typing before the timer melts.",
  })
  const [result, setResult] = useState<GameResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!category || gameState !== "active") {
      return
    }

    if (timeLeft <= 0) {
      setGameState("finished")
      finalizeGame(words.filter((word) => word.status === "valid").map((word) => word.value)).then(
        setResult,
      )
      return
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [category, gameState, timeLeft, words])

  if (loading || !category) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  const currentCategory = category
  const validWords = words.filter((word) => word.status === "valid")
  const urgency = timeLeft <= 10

  function handleStartGame() {
    setGameState("active")
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!input.trim() || gameState !== "active") {
      return
    }

    setSubmitting(true)
    const submission = await submitWord(
      currentCategory,
      validWords.map((word) => word.value),
      input,
    )

    if (submission.status === "valid") {
      setWords((current) => [
        { value: submission.normalized, status: "valid" },
        ...current,
      ])
      setFeedback({ state: "valid", label: `+1 point. ${submission.normalized} accepted.` })
    } else if (submission.status === "duplicate") {
      setWords((current) => [
        { value: submission.normalized || input.trim().toLowerCase(), status: "duplicate" },
        ...current,
      ])
      setFeedback({ state: "duplicate", label: `${submission.normalized} already used.` })
    } else {
      setFeedback({ state: "invalid", label: `"${input.trim()}" does not count here.` })
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
    setGameState("pre-game")
    setFeedback({ state: "idle", label: "Fresh round. Keep the streak alive." })
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl">
        <section className="space-y-6">
          <Card className="w-full border-black bg-[#fff7d6] shadow-[12px_12px_0_0_#000]">
            <Card.Content className="space-y-6 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-3">
                  <Badge tone="accent">Today&apos;s category</Badge>
                  <div>
                    <h1 className="font-head text-5xl uppercase leading-none tracking-[0.12em] text-black">
                      {category.name}
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-black/70">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div
                  className={`border-2 border-black px-6 py-4 text-center shadow-[8px_8px_0_0_#000] ${urgency ? "bg-[#ff7a59] text-black" : "bg-white text-black"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
                    <Timer className="size-4" />
                    Timer
                  </div>
                  <div className="mt-2 font-head text-5xl uppercase">{timeLeft}</div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={gameState === "pre-game" ? "Waiting to start..." : "Type a word and hit Enter"}
                  autoFocus={gameState === "active"}
                  disabled={gameState !== "active" || submitting}
                  className="h-16 text-lg font-bold uppercase tracking-[0.08em]"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div
                    className={`border-2 border-black px-4 py-3 text-sm font-bold shadow-[6px_6px_0_0_#000] ${feedback.state === "valid"
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
                  <Button size="lg" disabled={gameState !== "active" || submitting}>
                    Submit word
                  </Button>
                </div>
              </form>

              <div className="grid gap-4 sm:grid-cols-[0.35fr_1fr]">
                <div className="border-2 border-black bg-[#10131d] p-5 text-white shadow-[8px_8px_0_0_#000]">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                    Score
                  </div>
                  <div className="mt-3 font-head text-6xl uppercase">{validWords.length}</div>
                </div>
                <div className="border-2 border-black bg-white p-4 shadow-[8px_8px_0_0_#000]">
                  <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-black/60">
                    Captured words
                  </div>
                  <div className="flex min-h-24 flex-wrap gap-3">
                    {words.length === 0 ? (
                      <div className="text-sm text-black/60">
                        No entries yet. The board starts moving once you do.
                      </div>
                    ) : (
                      words.map((word, index) => (
                        <div
                          key={`${word.value}-${index}`}
                          className={`border-2 border-black px-3 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#000] ${word.status === "valid"
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
              Ready?
            </div>
            <div className="font-head text-4xl uppercase leading-none text-black sm:text-5xl">
              {category.name}
            </div>
            <Dialog.Description className="mt-3 max-w-[36ch] text-base font-bold text-black/80">
              Type as many {category.name.toLowerCase()} as you can in 60 seconds. 1 point per valid word.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer className="border-black bg-[#fff7d6] px-5 py-4 sm:px-8 sm:py-5" position="static">
            <Button size="lg" className="w-full sm:w-auto" onClick={handleStartGame}>
              Start today&apos;s round
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      <Modal
        open={gameState === "finished"}
        title={`You scored ${result?.score ?? 0}`}
        description="Your demo run is finished. This result panel is already shaped like a backend-friendly payload."
        actionLabel="Play again"
        onAction={handleReset}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
              Best score
            </div>
            <div className="mt-2 font-head text-4xl uppercase text-black">
              {result?.bestScore}
            </div>
          </div>
          <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
              Streak after round
            </div>
            <div className="mt-2 font-head text-4xl uppercase text-black">
              {result?.streak}
            </div>
          </div>
          <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
              Percentile
            </div>
            <div className="mt-2 font-head text-4xl uppercase text-black">
              {result?.percentile}%
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
            Valid words
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
