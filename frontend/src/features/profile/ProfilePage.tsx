import { CalendarDays, Flame, Trophy } from "lucide-react"

import { Card } from "@/components/retroui/Card"
import { AvatarBlock } from "@/components/ui/AvatarBlock"
import { Badge } from "@/components/ui/Badge"
import { Loader } from "@/components/ui/Loader"
import { SectionIntro } from "@/features/shared/SectionIntro"
import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchUserProfile } from "@/lib/api"

export function ProfilePage() {
  const { data, loading, error } = useAsyncData(fetchUserProfile, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-2 border-black bg-white px-6 py-4 text-black shadow-[6px_6px_0_0_#000]">
          Impossible de charger le profil pour le moment.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Identité joueur"
        title="Profil"
        description="Ton profil authentifié et la progression de ton compte."
      />

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-black bg-[#ffe45e] shadow-[8px_8px_0_0_#000] sm:shadow-[12px_12px_0_0_#000]">
          <Card.Content className="space-y-6 p-5 text-black sm:p-8">
            <AvatarBlock letters={data.avatarLetters} size="lg" />
            <div>
              <div className="font-head text-4xl uppercase sm:text-5xl">{data.username}</div>
              <p className="mt-3 max-w-md text-sm leading-6 text-black/75">{data.tagline}</p>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0_0_#000]">
                <CalendarDays className="size-5" />
                <span className="text-sm font-bold">Inscrit le {data.joinedAt}</span>
              </div>
              <div className="flex items-center gap-3 border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0_0_#000]">
                <Flame className="size-5 text-[#ff7a59]" />
                <span className="text-sm font-bold">{data.stats.currentStreak} jours de série en cours</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        <div className="grid gap-6">
          <Card className="border-black bg-white shadow-[8px_8px_0_0_#000] sm:shadow-[12px_12px_0_0_#000]">
            <Card.Header className="border-b-2 border-black">
              <Card.Title className="text-black">Résumé des statistiques</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Moyenne", value: data.stats.averageScore },
                  { label: "Meilleur", value: data.stats.bestScore },
                  { label: "Parties", value: data.stats.gamesPlayed },
                  { label: "Série", value: data.stats.currentStreak },
                ].map((item) => (
                <div
                  key={item.label}
                  className="border-2 border-black bg-[#f6f3ea] p-4 text-black shadow-[4px_4px_0_0_#000]"
                >
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-black/60">
                    {item.label}
                  </div>
                  <div className="mt-2 font-head text-3xl uppercase sm:text-4xl">{item.value}</div>
                </div>
              ))}
            </Card.Content>
          </Card>

          <Card className="border-black bg-[#141922] shadow-[8px_8px_0_0_#000] sm:shadow-[12px_12px_0_0_#000]">
            <Card.Header className="border-b-2 border-black">
              <Card.Title className="text-white">Succès</Card.Title>
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
