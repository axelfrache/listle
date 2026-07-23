import { Card } from "@/components/retroui/Card"
import { Badge } from "@/components/ui/Badge"
import { ErrorState } from "@/components/ui/ErrorState"
import { Loader } from "@/components/ui/Loader"
import { MeterBar } from "@/components/ui/MeterBar"
import { SectionIntro } from "@/features/shared/SectionIntro"
import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchUserStats } from "@/lib/api"

export function StatsPage() {
  const { data, loading, error } = useAsyncData(fetchUserStats, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error || !data) {
    return <ErrorState message="Impossible de charger les statistiques pour le moment." />
  }

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Progression personnelle"
        title="Statistiques"
        description="Une vue rapide et motivante de ta progression sur les sprints quotidiens."
      />

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Score moyen", value: data.averageScore },
          { label: "Meilleur score", value: data.bestScore },
          { label: "Parties jouées", value: data.gamesPlayed },
          { label: "Série en cours", value: data.currentStreak },
        ].map((item, index) => (
          <Card
            key={item.label}
            className={`border-border shadow-md sm:shadow-lg ${
              index % 2 === 0 ? "bg-white" : "bg-primary"
            }`}
          >
            <Card.Content className="space-y-3 p-5 text-black">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-black/70">
                {item.label}
              </div>
              <div className="font-head text-4xl uppercase sm:text-5xl">{item.value}</div>
            </Card.Content>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-border bg-white shadow-md sm:shadow-xl">
          <Card.Header className="border-b-2 border-border">
            <Card.Title className="text-black">Rythme hebdomadaire</Card.Title>
            <Card.Description>Scores récents sur les sept dernières sessions.</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4">
            {data.weeklyTrend.map((point, index) => (
              <div key={point.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-black/70">
                  <span>{point.label}</span>
                  <span>{point.value}</span>
                </div>
                <MeterBar
                  value={point.value}
                  max={25}
                  tone={index > 4 ? "green" : index > 2 ? "yellow" : "orange"}
                />
              </div>
            ))}
          </Card.Content>
        </Card>

        <Card className="border-border bg-[#141922] shadow-md sm:shadow-xl">
          <Card.Header className="border-b-2 border-border">
            <Card.Title className="text-white">Catégories les plus fortes</Card.Title>
            <Card.Description className="text-white/70">
              Les catégories où ta vitesse et ta mémoire sont les plus efficaces.
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4">
            {data.strongestCategories.map((item) => (
              <div
                key={item.category}
                className="space-y-3 border-2 border-border bg-white p-4 text-black shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-head text-2xl uppercase">{item.category}</div>
                  <Badge tone="accent">Meilleur {item.bestScore}</Badge>
                </div>
                <div className="text-sm text-black/70">Moyenne {item.averageScore} mots</div>
                <MeterBar value={item.averageScore} max={25} tone="green" />
              </div>
            ))}
          </Card.Content>
        </Card>
      </section>

      <Card className="border-border bg-[#fff7d6] shadow-md sm:shadow-xl">
        <Card.Header className="border-b-2 border-border">
          <Card.Title className="text-black">Historique récent</Card.Title>
          <Card.Description>
            Un résumé compact de tes dernières catégories et scores.
          </Card.Description>
        </Card.Header>
        <Card.Content className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {data.recentHistory.map((entry) => (
            <div
              key={`${entry.date}-${entry.category}`}
              className="space-y-3 border-2 border-border bg-white p-4 text-black shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-black/70">
                  {entry.date}
                </div>
              </div>
              <div className="font-head text-2xl uppercase">{entry.category}</div>
              <div className="font-head text-4xl uppercase">{entry.score}</div>
            </div>
          ))}
        </Card.Content>
      </Card>
    </div>
  )
}
