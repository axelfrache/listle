import { Link } from "react-router-dom"
import { Flame, Gauge } from "lucide-react"

import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { ErrorState } from "@/components/ui/ErrorState"
import { Loader } from "@/components/ui/Loader"

import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchDashboardData } from "@/lib/api"

export function LandingPage() {
  const { data, loading, error } = useAsyncData(fetchDashboardData, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error || !data) {
    return <ErrorState message="Impossible de charger les données d'accueil." />
  }

  const { snapshot } = data

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h1 className="font-head text-4xl uppercase leading-[0.9] tracking-[0.08em] text-foreground sm:text-6xl sm:tracking-[0.12em] lg:text-7xl">
              Un thème… et 60 secondes pour battre le record
            </h1>
            <p className="max-w-2xl text-base leading-7 text-foreground/80 sm:text-lg">
              Chaque jour, une nouvelle catégorie. Trouve un maximum de mots, marque des points et
              grimpe dans le classement.
            </p>
          </div>
          <div>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/play">Jouer la manche du jour</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="border-border bg-accent shadow-md sm:shadow-xl">
            <Card.Content className="space-y-4 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <Gauge className="size-6 text-black" />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-black/70">
                    Catégorie du jour
                  </div>
                  <div className="font-head text-2xl uppercase text-black sm:text-3xl">
                    {snapshot.category.name}
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold leading-6 text-black">
                Trouve un maximum de {snapshot.category.name.toLowerCase()} en 60 secondes.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="border-2 border-border bg-white p-3 shadow-sm">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-black/70">
                    Temps
                  </div>
                  <div className="mt-1 font-head text-xl uppercase text-black">60s</div>
                </div>
                <div className="border-2 border-border bg-highlight p-3 shadow-sm">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-black/70">
                    Score
                  </div>
                  <div className="mt-1 font-head text-xl uppercase text-black">
                    +1 point par mot
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="border-border bg-white shadow-md sm:shadow-xl">
            <Card.Content className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-black/70">
                  Série actuelle
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Flame className="size-7 text-highlight" />
                  <span className="font-head text-3xl uppercase text-black sm:text-4xl">
                    {snapshot.userStreak} jours
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-black/70">
                  Record du jour
                </div>
                <div className="mt-2 font-head text-3xl uppercase text-black sm:text-4xl">
                  {snapshot.userBestScore}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-white shadow-md sm:shadow-lg">
          <Card.Header className="border-b-2 border-border">
            <Card.Title className="text-black">Meilleurs joueurs du jour</Card.Title>
            <Card.Description>Les meilleurs scores sur la catégorie du jour.</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-3">
            {snapshot.leaderboardPreview.map((entry) => (
              <div
                key={entry.username}
                className="flex items-center justify-between gap-3 border-2 border-border bg-[#f6f3ea] px-3 py-3 shadow-sm sm:px-4"
              >
                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-black/70">
                    #{entry.rank}
                  </div>
                  <div className="truncate font-head text-lg uppercase text-black sm:text-xl">
                    {entry.username}
                  </div>
                </div>
                <div className="font-head text-2xl uppercase text-black">{entry.score}</div>
              </div>
            ))}
          </Card.Content>
        </Card>

        <Card className="border-border bg-[#fff7d6] shadow-md sm:shadow-lg lg:col-span-2">
          <Card.Header className="border-b-2 border-border">
            <Card.Title className="text-black">Règles du jeu</Card.Title>
            <Card.Description>Facile à comprendre, difficile à battre.</Card.Description>
          </Card.Header>
          <Card.Content className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6">
            {[
              {
                title: "Découvre la catégorie",
                body: "Une nouvelle catégorie apparaît chaque jour.",
              },
              {
                title: "Trouve vite",
                body: "Enchaîne les mots sans t'arrêter. Chaque bonne réponse marque immédiatement.",
              },
              {
                title: "Grimpe dans le classement",
                body: "Compare ton score aux meilleurs joueurs et fais durer ta série.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="space-y-3 border-2 border-border bg-white p-4 shadow-sm"
              >
                <div className="text-xs font-black uppercase tracking-[0.22em] text-black/70">
                  0{index + 1}
                </div>
                <div className="font-head text-xl uppercase text-black sm:text-2xl">
                  {item.title}
                </div>
                <p className="text-sm leading-6 text-black/70">{item.body}</p>
              </div>
            ))}
          </Card.Content>
        </Card>
      </section>
    </div>
  )
}
