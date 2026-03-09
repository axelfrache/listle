import { Trophy } from "lucide-react"

import { Card } from "@/components/retroui/Card"
import { Table } from "@/components/retroui/Table"
import { Badge } from "@/components/ui/Badge"
import { Loader } from "@/components/ui/Loader"
import { Tabs } from "@/components/ui/Tabs"
import { SectionIntro } from "@/features/shared/SectionIntro"
import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchLeaderboard } from "@/lib/api"
import type { LeaderboardWindow } from "@/types/models"
import { useState } from "react"

const tabItems: { label: string; value: LeaderboardWindow }[] = [
  { label: "Quotidien", value: "daily" },
  { label: "Hebdomadaire", value: "weekly" },
  { label: "Général", value: "global" },
]

function getPodiumNameClass(username: string) {
  const size = username.length
  if (size <= 10) {
    return "text-3xl sm:text-4xl"
  }
  if (size <= 14) {
    return "text-2xl sm:text-3xl"
  }
  if (size <= 18) {
    return "text-xl sm:text-2xl"
  }
  return "text-lg sm:text-xl"
}

export function LeaderboardPage() {
  const [timeWindow, setTimeWindow] = useState<LeaderboardWindow>("daily")
  const { data, loading, error } = useAsyncData(() => fetchLeaderboard(timeWindow), [timeWindow])

  const topThree = data?.slice(0, 3) ?? []
  const rest = data?.slice(3) ?? []

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
      <SectionIntro
        eyebrow="Tableau compétitif"
        title="Classement"
        description="Bascule entre les périodes et vois où se place ta manche. Les meilleures places sont traitées comme des trophées."
        action={<Tabs items={tabItems} value={timeWindow} onChange={setTimeWindow} />}
      />

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader />
        </div>
      ) : error || !data ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="border-2 border-black bg-white px-6 py-4 text-black shadow-[6px_6px_0_0_#000]">
            Impossible de charger le classement.
          </div>
        </div>
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            {topThree.map((entry, index) => (
              <Card
                key={entry.username}
                className={`w-full border-black shadow-[10px_10px_0_0_#000] ${
                  index === 0 ? "bg-[#ffe45e]" : index === 1 ? "bg-white" : "bg-[#68f2a3]"
                }`}
              >
                <Card.Content className="flex min-h-40 flex-col justify-between space-y-4 p-4 text-black sm:min-h-44 sm:p-6">
                  <div className="flex items-center justify-between">
                    <Badge tone="dark">#{entry.rank}</Badge>
                    <Trophy className="size-6" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`w-full break-words font-head uppercase leading-none ${getPodiumNameClass(entry.username)}`}
                      title={entry.username}
                    >
                      {entry.username}
                    </div>
                    <div className="text-sm text-black/70">{entry.streak} jours de série</div>
                  </div>
                  <div className="font-head text-5xl uppercase sm:text-6xl">{entry.score}</div>
                </Card.Content>
              </Card>
            ))}
          </section>

          <Card className="w-full border-black bg-white shadow-[12px_12px_0_0_#000]">
            <Card.Header className="border-b-2 border-black">
              <Card.Title className="text-black">Classement complet</Card.Title>
              <Card.Description>La ligne de l'utilisateur courant reste surlignée pour un repérage rapide.</Card.Description>
            </Card.Header>
            <Card.Content className="p-0 text-black">
              {data.length === 0 ? (
                <div className="p-10 text-center text-sm text-black/60">
                  Aucun score n'a encore été publié sur cette période.
                </div>
              ) : (
                <Table className="border-0 shadow-none text-black">
                  <Table.Header>
                    <Table.Row className="hover:bg-primary">
                      <Table.Head>Rang</Table.Head>
                      <Table.Head>Joueur</Table.Head>
                      <Table.Head>Série</Table.Head>
                      <Table.Head className="text-right">Score</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {(rest.length > 0 ? rest : data).map((entry) => (
                      <Table.Row
                        key={`${timeWindow}-${entry.username}`}
                        className={
                          entry.isCurrentUser
                            ? "bg-[#ffe45e] text-black"
                            : "text-black hover:bg-black/5 hover:text-black"
                        }
                      >
                        <Table.Cell className="font-black">#{entry.rank}</Table.Cell>
                        <Table.Cell className="font-head text-base uppercase sm:text-xl">
                          {entry.username}
                        </Table.Cell>
                        <Table.Cell>{entry.streak} jours</Table.Cell>
                        <Table.Cell className="text-right font-head text-xl uppercase sm:text-2xl">
                          {entry.score}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}
            </Card.Content>
          </Card>
        </>
      )}
    </div>
  )
}
