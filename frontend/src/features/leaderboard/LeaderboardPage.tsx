import { Trophy } from "lucide-react"

import { Card } from "@/components/retroui/Card"
import { Table } from "@/components/retroui/Table"
import { Badge } from "@/components/ui/Badge"
import { Loader } from "@/components/ui/Loader"
import { Tabs } from "@/components/ui/Tabs"
import { SectionIntro } from "@/features/shared/SectionIntro"
import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchLeaderboard } from "@/lib/mock-api"
import type { LeaderboardWindow } from "@/types/models"
import { useState } from "react"

const tabItems: { label: string; value: LeaderboardWindow }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Global", value: "global" },
]

function getPodiumNameClass(username: string) {
  const size = username.length
  if (size <= 9) {
    return "text-4xl xl:text-5xl"
  }
  if (size <= 12) {
    return "text-3xl xl:text-4xl"
  }
  if (size <= 16) {
    return "text-2xl xl:text-3xl"
  }
  return "text-xl xl:text-2xl"
}

export function LeaderboardPage() {
  const [window, setWindow] = useState<LeaderboardWindow>("daily")
  const { data, loading } = useAsyncData(() => fetchLeaderboard(window), [window])

  const topThree = data?.slice(0, 3) ?? []
  const rest = data?.slice(3) ?? []

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <SectionIntro
        eyebrow="Competitive board"
        title="Leaderboard"
        description="Switch between time windows and see where your run sits. Top slots are treated like trophies, not plain rows."
        action={<Tabs items={tabItems} value={window} onChange={setWindow} />}
      />

      {loading || !data ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-12">
            {topThree.map((entry, index) => (
              <Card
                key={entry.username}
                className={`w-full border-black shadow-[10px_10px_0_0_#000] ${
                  index === 0
                    ? "md:col-span-2 xl:col-span-12"
                    : "md:col-span-1 xl:col-span-6"
                } ${
                  index === 0 ? "bg-[#ffe45e]" : index === 1 ? "bg-white" : "bg-[#68f2a3]"
                }`}
              >
                <Card.Content className="flex min-h-44 flex-col justify-between space-y-4 p-6 text-black">
                  <div className="flex items-center justify-between">
                    <Badge tone="dark">#{entry.rank}</Badge>
                    <Trophy className="size-6" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`w-full truncate font-head uppercase leading-none ${getPodiumNameClass(entry.username)}`}
                      title={entry.username}
                    >
                      {entry.username}
                    </div>
                    <div className="text-sm text-black/70">{entry.streak}-day streak</div>
                  </div>
                  <div className="font-head text-6xl uppercase">{entry.score}</div>
                </Card.Content>
              </Card>
            ))}
          </section>

          <Card className="w-full border-black bg-white shadow-[12px_12px_0_0_#000]">
            <Card.Header className="border-b-2 border-black">
              <Card.Title className="text-black">Full ranking</Card.Title>
              <Card.Description>Current user row stays highlighted for quick scanning.</Card.Description>
            </Card.Header>
            <Card.Content className="p-0 text-black">
              {data.length === 0 ? (
                <div className="p-10 text-center text-sm text-black/60">
                  Nobody has posted a score in this window yet.
                </div>
              ) : (
                <Table className="border-0 shadow-none text-black">
                  <Table.Header>
                    <Table.Row className="hover:bg-primary">
                      <Table.Head>Rank</Table.Head>
                      <Table.Head>Player</Table.Head>
                      <Table.Head>Streak</Table.Head>
                      <Table.Head className="text-right">Score</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {(rest.length > 0 ? rest : data).map((entry) => (
                      <Table.Row
                        key={`${window}-${entry.username}`}
                        className={
                          entry.isCurrentUser
                            ? "bg-[#ffe45e] text-black"
                            : "text-black hover:bg-black/5 hover:text-black"
                        }
                      >
                        <Table.Cell className="font-black">#{entry.rank}</Table.Cell>
                        <Table.Cell className="font-head text-xl uppercase">
                          {entry.username}
                        </Table.Cell>
                        <Table.Cell>{entry.streak} days</Table.Cell>
                        <Table.Cell className="text-right font-head text-2xl uppercase">
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
