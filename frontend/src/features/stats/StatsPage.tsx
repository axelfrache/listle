import { Card } from "@/components/retroui/Card"
import { Badge } from "@/components/ui/Badge"
import { Loader } from "@/components/ui/Loader"
import { MeterBar } from "@/components/ui/MeterBar"
import { SectionIntro } from "@/features/shared/SectionIntro"
import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchUserStats } from "@/lib/mock-api"

export function StatsPage() {
  const { data, loading } = useAsyncData(fetchUserStats, [])

  if (loading || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Personal progression"
        title="Stats"
        description="A quick, motivating view of how your daily vocabulary sprint is trending."
      />

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Average score", value: data.averageScore },
          { label: "Best score", value: data.bestScore },
          { label: "Games played", value: data.gamesPlayed },
          { label: "Current streak", value: data.currentStreak },
        ].map((item, index) => (
          <Card
            key={item.label}
            className={`border-black shadow-[10px_10px_0_0_#000] ${
              index % 2 === 0 ? "bg-white" : "bg-[#ffe45e]"
            }`}
          >
            <Card.Content className="space-y-3 p-5 text-black">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
                {item.label}
              </div>
              <div className="font-head text-5xl uppercase">{item.value}</div>
            </Card.Content>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-black bg-white shadow-[12px_12px_0_0_#000]">
          <Card.Header className="border-b-2 border-black">
            <Card.Title className="text-black">Weekly rhythm</Card.Title>
            <Card.Description>Recent scores across the last seven sessions.</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4">
            {data.weeklyTrend.map((point, index) => (
              <div key={point.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-black/60">
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

        <Card className="border-black bg-[#141922] shadow-[12px_12px_0_0_#000]">
          <Card.Header className="border-b-2 border-black">
            <Card.Title className="text-white">Strongest categories</Card.Title>
            <Card.Description className="text-white/70">
              Categories where your speed and recall are currently strongest.
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4">
            {data.strongestCategories.map((item) => (
              <div
                key={item.category}
                className="space-y-3 border-2 border-black bg-white p-4 text-black shadow-[4px_4px_0_0_#000]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-head text-2xl uppercase">{item.category}</div>
                  <Badge tone="accent">Best {item.bestScore}</Badge>
                </div>
                <div className="text-sm text-black/70">Average {item.averageScore} words</div>
                <MeterBar value={item.averageScore} max={25} tone="green" />
              </div>
            ))}
          </Card.Content>
        </Card>
      </section>

      <Card className="border-black bg-[#fff7d6] shadow-[12px_12px_0_0_#000]">
        <Card.Header className="border-b-2 border-black">
          <Card.Title className="text-black">Recent history</Card.Title>
          <Card.Description>A compact log of recent categories and placements.</Card.Description>
        </Card.Header>
        <Card.Content className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {data.recentHistory.map((entry) => (
            <div
              key={`${entry.date}-${entry.category}`}
              className="space-y-3 border-2 border-black bg-white p-4 text-black shadow-[4px_4px_0_0_#000]"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-black/60">
                  {entry.date}
                </div>
                <Badge tone="dark">{entry.percentile}%</Badge>
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
