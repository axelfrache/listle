import { CalendarDays, Flame, Trophy } from "lucide-react"

import { Card } from "@/components/retroui/Card"
import { AvatarBlock } from "@/components/ui/AvatarBlock"
import { Badge } from "@/components/ui/Badge"
import { Loader } from "@/components/ui/Loader"
import { SectionIntro } from "@/features/shared/SectionIntro"
import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchUserProfile } from "@/lib/mock-api"

export function ProfilePage() {
  const { data, loading } = useAsyncData(fetchUserProfile, [])

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
        eyebrow="Player identity"
        title="Profile"
        description="A frontend-only profile screen, already shaped for account, achievements, and summary data."
      />

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-black bg-[#ffe45e] shadow-[12px_12px_0_0_#000]">
          <Card.Content className="space-y-6 p-8 text-black">
            <AvatarBlock letters={data.avatarLetters} size="lg" />
            <div>
              <div className="font-head text-5xl uppercase">{data.username}</div>
              <p className="mt-3 max-w-md text-sm leading-6 text-black/75">{data.tagline}</p>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0_0_#000]">
                <CalendarDays className="size-5" />
                <span className="text-sm font-bold">Joined {data.joinedAt}</span>
              </div>
              <div className="flex items-center gap-3 border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0_0_#000]">
                <Flame className="size-5 text-[#ff7a59]" />
                <span className="text-sm font-bold">{data.stats.currentStreak} day current streak</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        <div className="grid gap-6">
          <Card className="border-black bg-white shadow-[12px_12px_0_0_#000]">
            <Card.Header className="border-b-2 border-black">
              <Card.Title className="text-black">Summary stats</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Average", value: data.stats.averageScore },
                { label: "Best", value: data.stats.bestScore },
                { label: "Games", value: data.stats.gamesPlayed },
                { label: "Streak", value: data.stats.currentStreak },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border-2 border-black bg-[#f6f3ea] p-4 text-black shadow-[4px_4px_0_0_#000]"
                >
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-black/60">
                    {item.label}
                  </div>
                  <div className="mt-2 font-head text-4xl uppercase">{item.value}</div>
                </div>
              ))}
            </Card.Content>
          </Card>

          <Card className="border-black bg-[#141922] shadow-[12px_12px_0_0_#000]">
            <Card.Header className="border-b-2 border-black">
              <Card.Title className="text-white">Achievements</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-4 md:grid-cols-3">
              {data.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="space-y-3 border-2 border-black bg-white p-4 text-black shadow-[4px_4px_0_0_#000]"
                >
                  <div className="flex items-center justify-between">
                    <Badge tone="accent">{badge.label}</Badge>
                    <Trophy className="size-5" />
                  </div>
                  <p className="text-sm leading-6 text-black/75">{badge.description}</p>
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>
      </section>
    </div>
  )
}
