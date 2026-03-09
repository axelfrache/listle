import { Link } from "react-router-dom"
import { Flame, Gauge } from "lucide-react"

import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Loader } from "@/components/ui/Loader"

import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchDashboardData } from "@/lib/mock-api"

export function LandingPage() {
  const { data, loading } = useAsyncData(fetchDashboardData, [])

  if (loading || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  const { snapshot } = data

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h1 className="font-head text-6xl uppercase leading-[0.9] tracking-[0.12em] text-foreground sm:text-7xl">
              Type fast.
              <br />
              Rank higher.
            </h1>
            <p className="max-w-2xl text-lg leading-7 text-foreground/80">
              Listle turns one category into a 60-second arcade sprint.
            </p>
          </div>
          <div>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/play">Play today&apos;s round</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="border-black bg-[#68f2a3] shadow-[12px_12px_0_0_#000]">
            <Card.Content className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <Gauge className="size-6 text-black" />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
                    Category today
                  </div>
                  <div className="font-head text-3xl uppercase text-black">
                    {snapshot.category.name}
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold leading-6 text-black">
                Type as many {snapshot.category.name.toLowerCase()} as you can in 60 seconds.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
                    Timer
                  </div>
                  <div className="mt-1 font-head text-xl uppercase text-black">60s</div>
                </div>
                <div className="border-2 border-black bg-[#ff7a59] p-3 shadow-[4px_4px_0_0_#000]">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-black/70">
                    Reward
                  </div>
                  <div className="mt-1 font-head text-xl uppercase text-black">1 pt / word</div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="border-black bg-white shadow-[12px_12px_0_0_#000]">
            <Card.Content className="grid gap-4 p-6 sm:grid-cols-2">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
                  Your streak
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Flame className="size-7 text-[#ff7a59]" />
                  <span className="font-head text-4xl uppercase text-black">
                    {snapshot.userStreak} days
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
                  Best today
                </div>
                <div className="mt-2 font-head text-4xl uppercase text-black">
                  {snapshot.userBestScore}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-black bg-white shadow-[10px_10px_0_0_#000]">
          <Card.Header className="border-b-2 border-black">
            <Card.Title className="text-black">Top players today</Card.Title>
            <Card.Description>Fast movers in the current category.</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-3">
            {snapshot.leaderboardPreview.map((entry) => (
              <div
                key={entry.username}
                className="flex items-center justify-between border-2 border-black bg-[#f6f3ea] px-4 py-3 shadow-[4px_4px_0_0_#000]"
              >
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-black/50">
                    #{entry.rank}
                  </div>
                  <div className="font-head text-xl uppercase text-black">
                    {entry.username}
                  </div>
                </div>
                <div className="font-head text-2xl uppercase text-black">{entry.score}</div>
              </div>
            ))}
          </Card.Content>
        </Card>

        <Card className="border-black bg-[#fff7d6] shadow-[10px_10px_0_0_#000] lg:col-span-2">
          <Card.Header className="border-b-2 border-black">
            <Card.Title className="text-black">The Rules</Card.Title>
            <Card.Description>Simple to learn, hard to master.</Card.Description>
          </Card.Header>
          <Card.Content className="grid gap-4 p-6 sm:grid-cols-3">
            {[
              {
                title: "See the category",
                body: "One new topic appears every day, tuned for fast recall.",
              },
              {
                title: "Type at speed",
                body: "Enter words continuously. Valid answers score instantly.",
              },
              {
                title: "Climb the board",
                body: "Compare your run with daily leaders and keep your streak alive.",
              },
            ].map((item, index) => (
              <div key={item.title} className="space-y-3 border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-black/50">
                  0{index + 1}
                </div>
                <div className="font-head text-2xl uppercase text-black">{item.title}</div>
                <p className="text-sm leading-6 text-black/70">{item.body}</p>
              </div>
            ))}
          </Card.Content>
        </Card>
      </section>
    </div>
  )
}
