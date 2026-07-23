import { AlertTriangle, CalendarDays, RefreshCw } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Table } from "@/components/retroui/Table"
import { Badge } from "@/components/ui/Badge"
import { Loader } from "@/components/ui/Loader"
import { SectionIntro } from "@/features/shared/SectionIntro"
import { useAsyncData } from "@/hooks/useAsyncData"
import {
  fetchAdminCategories,
  fetchAdminSchedule,
  syncAllCategories,
  syncCategory,
} from "@/lib/api"

function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`)
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
}

export function AdminPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [syncingSlug, setSyncingSlug] = useState<string | null>(null)
  const [syncingAll, setSyncingAll] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const schedule = useAsyncData(() => fetchAdminSchedule(14), [refreshKey])
  const categories = useAsyncData(() => fetchAdminCategories(), [refreshKey])

  const busy = syncingSlug !== null || syncingAll

  async function handleSync(slug: string) {
    setSyncingSlug(slug)
    setMessage(null)
    try {
      const result = await syncCategory(slug)
      setMessage(`« ${slug} » synchronisée : ${result.added} ajoutés, ${result.totalWords} mots au total.`)
      setRefreshKey((key) => key + 1)
    } catch {
      setMessage(`Échec de la synchronisation de « ${slug} ».`)
    } finally {
      setSyncingSlug(null)
    }
  }

  async function handleSyncAll() {
    setSyncingAll(true)
    setMessage(null)
    try {
      const result = await syncAllCategories()
      setMessage(`Synchronisation globale : ${result.synced} catégories OK, ${result.failed} en échec.`)
      setRefreshKey((key) => key + 1)
    } catch {
      setMessage("Échec de la synchronisation globale.")
    } finally {
      setSyncingAll(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
      <SectionIntro
        eyebrow="Espace admin"
        title="Catégories & planning"
        description="Consulte les catégories à venir (rotation déterministe) et rafraîchis les mots depuis Wikidata."
        action={
          <Button variant="secondary" onClick={handleSyncAll} disabled={busy}>
            <RefreshCw className={`mr-2 size-4 ${syncingAll ? "animate-spin" : ""}`} />
            {syncingAll ? "Synchronisation…" : "Tout resynchroniser"}
          </Button>
        }
      />

      {message ? (
        <div className="border-2 border-black bg-[#ffe45e] px-4 py-3 text-sm font-bold text-black shadow-[6px_6px_0_0_#000]">
          {message}
        </div>
      ) : null}

      <Card className="w-full border-black bg-white shadow-[12px_12px_0_0_#000]">
        <Card.Header className="border-b-2 border-black">
          <Card.Title className="flex items-center gap-2 text-black">
            <CalendarDays className="size-5" /> Catégories à venir (14 jours)
          </Card.Title>
          <Card.Description>
            Projection basée sur la rotation. Une catégorie non figée peut encore changer si tu actives/désactives des thèmes.
          </Card.Description>
        </Card.Header>
        <Card.Content className="p-0 text-black">
          {schedule.loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <Loader />
            </div>
          ) : schedule.error || !schedule.data ? (
            <div className="p-8 text-center text-sm text-black/60">Impossible de charger le planning.</div>
          ) : (
            <Table className="border-0 shadow-none text-black">
              <Table.Header>
                <Table.Row className="hover:bg-primary">
                  <Table.Head>Date</Table.Head>
                  <Table.Head>Catégorie</Table.Head>
                  <Table.Head>Mots</Table.Head>
                  <Table.Head className="text-right">État</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {schedule.data.map((item, index) => (
                  <Table.Row
                    key={item.date}
                    className={index === 0 ? "bg-[#68f2a3] text-black" : "text-black hover:bg-black/5"}
                  >
                    <Table.Cell className="font-black uppercase">{formatDate(item.date)}</Table.Cell>
                    <Table.Cell className="font-head text-base uppercase sm:text-lg">{item.name}</Table.Cell>
                    <Table.Cell>
                      <span className="inline-flex items-center gap-2">
                        {item.wordCount}
                        {item.wordCount === 0 ? <AlertTriangle className="size-4 text-[#c0392b]" /> : null}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      {index === 0 ? (
                        <Badge tone="dark">Aujourd'hui</Badge>
                      ) : item.frozen ? (
                        <Badge tone="neutral">Figée</Badge>
                      ) : (
                        <Badge tone="accent">Prévue</Badge>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Card.Content>
      </Card>

      <Card className="w-full border-black bg-white shadow-[12px_12px_0_0_#000]">
        <Card.Header className="border-b-2 border-black">
          <Card.Title className="text-black">Catégories</Card.Title>
          <Card.Description>Source, nombre de mots en cache et resynchronisation individuelle.</Card.Description>
        </Card.Header>
        <Card.Content className="p-0 text-black">
          {categories.loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <Loader />
            </div>
          ) : categories.error || !categories.data ? (
            <div className="p-8 text-center text-sm text-black/60">Impossible de charger les catégories.</div>
          ) : (
            <Table className="border-0 shadow-none text-black">
              <Table.Header>
                <Table.Row className="hover:bg-primary">
                  <Table.Head>Catégorie</Table.Head>
                  <Table.Head>Source</Table.Head>
                  <Table.Head>Mots</Table.Head>
                  <Table.Head className="text-right">Action</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {categories.data.map((category) => {
                  const hasSource = Boolean(category.source)
                  return (
                    <Table.Row key={category.slug} className="text-black hover:bg-black/5">
                      <Table.Cell className="font-head text-base uppercase sm:text-lg">
                        {category.name}
                        {!category.active ? <Badge tone="danger" className="ml-2">Inactive</Badge> : null}
                      </Table.Cell>
                      <Table.Cell className="text-xs">
                        {hasSource ? category.source : <span className="text-black/50">manuelle</span>}
                      </Table.Cell>
                      <Table.Cell>{category.wordCount}</Table.Cell>
                      <Table.Cell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-black bg-white text-black"
                          disabled={!hasSource || busy}
                          onClick={() => handleSync(category.slug)}
                        >
                          <RefreshCw
                            className={`mr-1 size-3 ${syncingSlug === category.slug ? "animate-spin" : ""}`}
                          />
                          Sync
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          )}
        </Card.Content>
      </Card>
    </div>
  )
}
